import { PayloadAction, ThunkAction, UnknownAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { Album, AlbumCreation, NotificationType, PlayMode } from '../../types';
import type { AppAsyncThunkConfig, RootState } from '../store';
import * as albumService from '../../util/albumService';
import * as converterService from '../../util/converterService';
import { getErrorMessage } from '../../util/errorMessages';
import { getFilterFn, getNextAlbumInSequence, getRandomAlbum, getSortFn } from '../../util/albumHelpers';
import { queuePop, queueRemove, queueUpdate, selectIsQueued, selectQueueFirst } from './queueSlice';
import { selectPlayMode } from './settingsSlice';
import { removeFilterCategory, type selectFilters as SelectFilters } from './filterSlice';
import { createNotification } from './notificationSlice';

export interface AlbumsState {
  viewing: Album | null;
  playing: Album | null;
  albums: Album[];
};

export const initialState: AlbumsState = {
  viewing: null,
  playing: null,
  albums: [],
};

const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    view: (state, action: PayloadAction<Album | null>) => {
      const album = action.payload;
      state.viewing = album;
    },
    play: (state, action: PayloadAction<Album | null>) => {
      const album = action.payload;
      state.playing = album;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        const albums = action.payload;
        state.albums = albums;
      })
      .addCase(createFromBookmarks.fulfilled, (state, action) => {
        const newAlbums = action.payload;
        state.albums = state.albums.concat(newAlbums);
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        const newAlbum = action.payload;
        state.albums = [ ...state.albums, newAlbum ];
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        const updatedAlbum = action.payload;
        state.albums = state.albums.map((album) => 
          (album.id === updatedAlbum.id) ? updatedAlbum : album
        );

        // update viewing & playing
        const { viewing, playing } = state;
        if (viewing && viewing.id === updatedAlbum.id) {
          state.viewing = updatedAlbum;
        }
        if (playing && playing.id === updatedAlbum.id) {
          state.playing = updatedAlbum;
        }
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        const removedAlbumId = action.payload;
        state.albums = state.albums.filter((album) => album.id !== removedAlbumId);

        // update viewing, keep the current playing
        const { viewing } = state;
        if (viewing && viewing.id === removedAlbumId) {
          state.viewing = null;
        }
      })
  },
});

/*
Thunk Use Cases
- Moving complex logic out of components
- Side-effects, such as generating random values
- Making async requests or other async logic
- Writing logic that needs to dispatch multiple actions in a row or over time
- Writing logic that needs access to getState to make decisions or include
  other state values in an action

Thunks have access to the dispatch method. This can be used to dispatch actions,
or even other thunks. This can be useful for dispatching multiple actions in a
row (although this is a pattern that should be minimized), or orchestrating
complex logic that needs to dispatch at multiple points in the process.

Unlike components, thunks also have access to getState. This can be called at 
any time to retrieve the current root Redux state value. This can be useful for 
running conditional logic based on the current state. It's common to use selector 
functions when reading state inside of thunks rather than accessing nested state 
fields directly, but either approach is fine.

Since the state is synchronously updated as soon as the reducers process an action, 
you can call getState after a dispatch to get the updated state.
*/

// GET ALBUMS
export const fetchAlbums = createAsyncThunk<
  Album[],
  string,
  AppAsyncThunkConfig
>(
  'albums/fetchAlbums',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      return await albumService.getAlbums();
      
    } catch (error) {
      const message = getErrorMessage(error);

      dispatch(createNotification({
        type: NotificationType.ERROR,
        title: 'Loading albums failed',
        message,
      }));

      return rejectWithValue({ message });
    }
  }
);

// CREATE FROM BOOKMARKS
export const createFromBookmarks = createAsyncThunk<
  Album[],
  FormData,
  AppAsyncThunkConfig
>(
  'albums/createFromBookmarks',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const convertedAlbums = await converterService.convertBookmarks(formData);

      dispatch(createNotification({
        type: NotificationType.SUCCESS,
        title: 'Bookmarks imported',
      }));

      return convertedAlbums;

    } catch (error) {
      const message = getErrorMessage(error);

      dispatch(createNotification({
        type: NotificationType.ERROR,
        title: 'Bookmark import failed',
        message,
      }));

      return rejectWithValue({ message });
    }
  },
);

// CREATE
export const createAlbum = createAsyncThunk<
  Album,
  AlbumCreation,
  AppAsyncThunkConfig
>(
  'albums/create',
  async (albumValues: AlbumCreation, { dispatch, rejectWithValue }) => {
    try {
      const createdAlbum = await albumService.create(albumValues);

      dispatch(createNotification({
        type: NotificationType.SUCCESS,
        title: 'Album added successfully',
      }));

      return createdAlbum;

    } catch (error) {
      const message = getErrorMessage(error);

      dispatch(createNotification({
        type: NotificationType.ERROR,
        title: 'Album adding failed',
        message,
      }));

      return rejectWithValue({ message });
    }
  }
);

// UPDATE
export const updateAlbum = createAsyncThunk<
  Album,
  { oldAlbum: Album, newValues: AlbumCreation },
  AppAsyncThunkConfig
>(
  'albums/update',
  async ({ oldAlbum, newValues }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const { id, category: oldCategory, addDate } = oldAlbum;

    const isQueued = selectIsQueued(state, id);
    const isAloneInCategory = selectIsAloneInCategory(oldCategory)(state);

    try {
      const updatedAlbum = await albumService.update(id, {
        ...newValues,
        addDate, // keep the add date
      });

      dispatch(createNotification({
        type: NotificationType.SUCCESS,
        title: 'Album edited successfully',
      }));

      if (isQueued) { dispatch(queueUpdate(updatedAlbum)); }

      if (isAloneInCategory && updatedAlbum.category !== oldCategory) {
        dispatch(removeFilterCategory(oldCategory));
      }

      return updatedAlbum;

    } catch (error) {
      const message = getErrorMessage(error);

      dispatch(createNotification({
        type: NotificationType.ERROR,
        title: 'Album edit failed',
        message,
      }));

      return rejectWithValue({ message });
    }
  }
);

// DELETE
export const deleteAlbum = createAsyncThunk<
  Album['id'],
  Album,
  AppAsyncThunkConfig
>(
  'albums/delete',
  async (album, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const { id, category } = album;

    const isQueued = selectIsQueued(state, id);
    const isAloneInCategory = selectIsAloneInCategory(category)(state);

    try {
      const removedAlbumId = await albumService.remove(id);

      dispatch(createNotification({
        type: NotificationType.SUCCESS,
        title: 'Album removed successfully',
      }));

      if (isQueued) { dispatch(queueRemove(removedAlbumId)); }

      if (isAloneInCategory) {
        dispatch(removeFilterCategory(category));
      }

      return removedAlbumId;

    } catch (error) {
      const message = getErrorMessage(error);

      dispatch(createNotification({
        type: NotificationType.ERROR,
        title: 'Album deletion failed',
        message,
      }));

      return rejectWithValue({ message });
    }
  }
);

/**
 * Play next album.
 * 
 * Queued albums are always prioritized. Othervise, the next album
 * is choosen from the filtered and sorted albums list based on current
 * {@link PlayMode}.
 * 
 * @remarks
 * When the play mode is {@link PlayMode.SEQUENCE}, 
 * sequence will start over from the final queued album
 */
export const playNext = (): ThunkAction<
  void,         // Return type of the thunk function
  RootState,    // state type used by getState
  unknown,      // any "extra argument" injected into the thunk
  UnknownAction // known types of actions that can be dispatched
> => (dispatch, getState) => {

  const state = getState();
  const albums = selectSortedAndFilteredAlbums(state);
  const nextAlbumInQueue = selectQueueFirst(state);
  const playMode = selectPlayMode(state);
  const playingAlbum = selectPlaying(state);

  if (nextAlbumInQueue) { 
    // always prioritize queue
    dispatch(play(nextAlbumInQueue));
    dispatch(queuePop());

  } else {
    // no albums are queued
    switch (playMode) {
      case PlayMode.MANUAL: {
        dispatch(play(null));
        break;
      }
      case PlayMode.SEQUENCE: {
        dispatch(play(getNextAlbumInSequence(albums, playingAlbum)));
        break;
      }
      case PlayMode.SHUFFLE: {
        dispatch(play(getRandomAlbum(albums)));
        break;
      }
      default:
        playMode satisfies never;
    }
  }
};

export const { view, play } = albumsSlice.actions;

export const selectViewing = (state: RootState) => state.albums.viewing;
export const selectPlaying = (state: RootState) => state.albums.playing;
const selectAlbums = (state: RootState) => state.albums.albums;

export const selectCategories = createSelector(
  selectAlbums,
  (albums) => Array.from(new Set(albums.map(album => album.category)))
    .sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1)
);

export const selectIsAloneInCategory = (category: Album["category"]) => createSelector(
  selectAlbums,
  (albums) => albums.reduce(
    (prev, curr) => prev + (curr.category === category ? 1 : 0),
    0,
  ) === 1,
);

// avoid circular dependency, tests fail otherwise
const selectFilters: typeof SelectFilters = (state: RootState) => state.filters;

export const selectSortedAndFilteredAlbums = createSelector(
  selectAlbums,
  selectFilters,
  (albums, filters) => {
    const { sortColumn, sortOrder } = filters;

    return albums
      .filter(getFilterFn(filters))
      .toSorted(getSortFn(sortColumn, sortOrder));
  },
);

export const selectCanPlayNextAlbum = createSelector(
  selectSortedAndFilteredAlbums,
  selectQueueFirst,
  selectPlayMode,
  selectPlaying,
  (albums, nextAlbumInQueue, playMode, playingAlbum) => {
    // can play next from queue
    if (nextAlbumInQueue) { return true; }

    switch (playMode) {
      case PlayMode.MANUAL: {
        // can only play from queue
        return false;
      }
      case PlayMode.SEQUENCE: {
        // no sequence to play
        if (albums.length === 0) { return false; }

        // playing last album in sequence?
        return playingAlbum
          ? (albums[albums.length - 1].id !== playingAlbum.id)
          : false;
      }
      case PlayMode.SHUFFLE: {
        // only if there are albums
        return (albums.length > 0);
      }
      default:
        playMode satisfies never;
        return false;
    }
  },
);

export default albumsSlice.reducer;

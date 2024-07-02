import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { Album, AlbumCreation, NotificationType } from '../../../types';
import type { AppAsyncThunkConfig, RootState } from '../../store';
import * as albumService from '../../../util/albumService';
import * as converterService from '../../../util/converterService';
import { getErrorMessage } from '../../../util/errorMessages';
import { queueRemove, queueUpdate, selectIsQueued } from '../queueSlice';
import { removeFilteringCategory } from '../filters/filterSlice';
import { createNotification } from '../notificationSlice';

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
    setViewingAlbum: (state, action: PayloadAction<Album | null>) => {
      const album = action.payload;
      state.viewing = album;
    },
    setPlayingAlbum: (state, action: PayloadAction<Album | null>) => {
      const album = action.payload;
      state.playing = album;
    },
  },
  extraReducers: builder => {
    // async thunks
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

export const { setViewingAlbum, setPlayingAlbum } = albumsSlice.actions;

export default albumsSlice.reducer;

// SELECTORS

export const selectViewing = (state: RootState) => state.albums.viewing;

export const selectPlaying = (state: RootState) => state.albums.playing;

export const selectAlbums = (state: RootState) => state.albums.albums;

export const selectIsPlaying = (state: RootState, album: Album | null) => {
  const playing = selectPlaying(state);
  return album !== null && playing !== null && (album.id === playing.id);
};

export const selectIsViewing = (state: RootState, album: Album | null) => {
  const viewing = selectViewing(state);
  return album !== null && viewing !== null && (album.id === viewing.id);
};

export const selectAlbumCategories = createSelector(
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

// ASYNC THUNKS

// GET ALBUMS
export const fetchAlbums = createAsyncThunk<
  Album[],
  void,
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
        dispatch(removeFilteringCategory(oldCategory));
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
        dispatch(removeFilteringCategory(category));
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

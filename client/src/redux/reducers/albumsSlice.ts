import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { Album, AlbumCreation, PlayMode } from '../../types';
import { RootState } from '../store';
import * as albumService from '../../util/albumService';
import * as converterService from '../../util/converterService';
import { getErrorMessage } from '../../util/errorMessages';
import { selectFilters } from './filterSlice';
import { getFilterFn, getSortFn } from '../../util/albumHelpers';
import { selectQueueFirst } from './queueSlice';
import { selectPlayMode } from './settingsSlice';

export interface AlbumsState {
  viewing: Album | null;
  playing: Album | null;
  albums: Album[];
};

const initialState: AlbumsState = {
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


type RejectedResponse = { errorMessage: string };

export const isRejectedResponse = (error: unknown): error is RejectedResponse => {
  return (typeof error === 'object' && error !== null) &&
    ('errorMessage' in error && typeof error.errorMessage === 'string');
};

// GET ALBUMS
export const fetchAlbums = createAsyncThunk(
  'albums/fetchAlbums',
  async () => albumService.getAlbums(),
);

// CREATE FROM BOOKMARKS
export const createFromBookmarks = createAsyncThunk<
  Album[],
  FormData,
  { rejectValue: RejectedResponse }
>(
  'albums/createFromBookmarks',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await converterService.convertBookmarks(formData);
    } catch (error) {
      return rejectWithValue({ errorMessage: getErrorMessage(error) });
    }
  },
);

// CREATE
export const createAlbum = createAsyncThunk(
  'albums/create',
  async (albumValues: AlbumCreation, { rejectWithValue }) => {
    try {
      return await albumService.create(albumValues);
    } catch (error) {
      return rejectWithValue({ errorMessage: getErrorMessage(error) });
    }
  }
);

// UPDATE
export const updateAlbum = createAsyncThunk<
  Album,
  Album,
  { rejectValue: RejectedResponse }
>(
  'albums/update',
  async (album: Album, { rejectWithValue }) => {
    try {
      return await albumService.update(album);
    } catch (error) {
      return rejectWithValue({ errorMessage: getErrorMessage(error) });
    }
  }
);

// DELETE
export const deleteAlbum = createAsyncThunk<
  Album['id'],
  Album['id'],
  { rejectValue: RejectedResponse }
>(
  'albums/delete',
  async (id: Album['id'], { rejectWithValue }) => {
    try {
      return await albumService.remove(id);
    } catch (error) {
      return rejectWithValue({ errorMessage: getErrorMessage(error) });
    }
  }
);

export const { view, play } = albumsSlice.actions;

export const selectViewing = (state: RootState) => state.albums.viewing;
export const selectPlaying = (state: RootState) => state.albums.playing;
const selectAlbums = (state: RootState) => state.albums.albums;

export const selectCategories = createSelector(selectAlbums, (albums) => {
  return Array.from(new Set(albums.map(album => album.category))).sort(
    (a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1
  );
});

// export const selectCategoryCounts = createSelector(selectAlbums, (albums: Album[]) => {
//   return albums.reduce<Record<string, number>>(
//     (prev, current) => {
//       const { category } = current;
//       prev[category] = (category in prev) ? prev[category] + 1 : 0;
//       return prev;
//     }, {}
//   );
// });

export const selectIsAloneInCategory = (category: string) => createSelector(
  selectAlbums,
  (albums) => albums.reduce(
    (prev, curr) => prev + (curr.category === category ? 1 : 0),
    0,
  ) === 1,
);

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


/**
 * Creates a memoized album selector function.
 * 
 * Queued albums are always prioritized. Othervise, the next album
 * is choosen from the filtered and sorted albums list based on current
 * {@link PlayMode}.
 * 
 * @remarks
 * When the play mode is {@link PlayMode.SEQUENCE}, 
 * sequence will start over from the final queued album
 */
/*
export const selectNextPlayingAlbum = (state: RootState) => {
  const albums = selectSortedAndFilteredAlbums(state);
  const nextAlbumInQueue = selectQueueFirst(state);
  const playMode = selectPlayMode(state);
  const playingAlbum = selectPlaying(state);

  let album: Album | null = null;
  let queue = false;
  if (nextAlbumInQueue) { 
    // always prioritize queue
    album = nextAlbumInQueue;
    queue = true;
  } else {
    // no albums are queued
    switch (playMode) {
      case PlayMode.MANUAL: {
        album = null;
        break;
      }
      case PlayMode.SEQUENCE: {
        album = getNextAlbumInSequence(albums, playingAlbum);
        break;
      }
      case PlayMode.SHUFFLE: {
        album = getRandomAlbum(albums);
        break;
      }
      default:
        playMode satisfies never;
    }
  }
  return { album, queue };
};
*/

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

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { Album } from '../../types';
import { RootState } from '../store';

export interface AlbumsState {
  viewing: Album | null;
  playing: Album | null;
  queue: Album[];
};

const initialState: AlbumsState = {
  viewing: null,
  playing: null,
  queue: [],
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
    pushQueue: (state, action: PayloadAction<Album>) => {
      const albumToAdd = action.payload;

      const found = state.queue.find(
        (album) => album.videoId === albumToAdd.videoId
      );
      if (!found) {
        state.queue.push(albumToAdd);
      }
    },
    removeQueue: (state, action: PayloadAction<Album>) => {
      const albumToRemove = action.payload;
      state.queue = state.queue.filter(
        (album) => album.videoId !== albumToRemove.videoId
      );
    },
    prependQueue: (state, action: PayloadAction<Album>) => {
      const albumToAdd = action.payload;

      const filtered = state.queue.filter(
        (album) => album.videoId !== albumToAdd.videoId
      );

      state.queue = [albumToAdd, ...filtered];
    },
  },
});

export const { view, play, pushQueue, removeQueue, prependQueue } = albumsSlice.actions;

export const selectViewing = (state: RootState) => state.albums.viewing;
export const selectPlaying = (state: RootState) => state.albums.playing;
export const selectQueue = (state: RootState) => state.albums.queue;

export const selectQueueFirst = (state: RootState) => {
  if (state.albums.queue.length > 0) {
    return state.albums.queue[0];
  }
  return null;
};

export const selectExistsInQueue = createSelector(
  [selectQueue, (_state, album) => album],
  (queue, album) => queue.find((q) => q.videoId === album.videoId) !== undefined,
);

export default albumsSlice.reducer;

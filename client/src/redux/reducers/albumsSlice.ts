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
    queueAdd: (state, action: PayloadAction<Album>) => {
      const albumToAdd = action.payload;
      const filtered = state.queue.filter(
        (album) => album.videoId !== albumToAdd.videoId
      );

      state.queue = [...filtered, albumToAdd];
    },
    queueRemove: (state, action: PayloadAction<Album>) => {
      const albumToRemove = action.payload;
      state.queue = state.queue.filter(
        (album) => album.videoId !== albumToRemove.videoId
      );
    },
    queuePrepend: (state, action: PayloadAction<Album>) => {
      const albumToAdd = action.payload;

      const filtered = state.queue.filter(
        (album) => album.videoId !== albumToAdd.videoId
      );

      state.queue = [albumToAdd, ...filtered];
    },
    queuePop: (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [first, ...others] = state.queue;
      state.queue = others;
    },
  },
});

export const { view, play, queueAdd, queueRemove, queuePrepend, queuePop } = albumsSlice.actions;

export const selectViewing = (state: RootState) => state.albums.viewing;
export const selectPlaying = (state: RootState) => state.albums.playing;
export const selectQueue = (state: RootState) => state.albums.queue;

export const selectQueueFirst = (state: RootState) => {
  const queue = selectQueue(state);
  return (queue.length > 0) ? queue[0]: null;
};

export const isQueued = createSelector(
  [selectQueue, (_state, album) => album],
  (queue, album) => queue.find((q) => q.videoId === album.videoId) !== undefined,
);

export default albumsSlice.reducer;

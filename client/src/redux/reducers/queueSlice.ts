import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { Album } from '../../types';
import { RootState } from '../store';

export interface QueueState {
  queue: Album[];
};

const initialState: QueueState = {
  queue: [],
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    queueAdd: (state, action: PayloadAction<Album>) => {
      const albumToAdd = action.payload;
      const filtered = state.queue.filter(
        (album) => album.id !== albumToAdd.id,
      );

      state.queue = [...filtered, albumToAdd];
    },
    queueRemove: (state, action: PayloadAction<Album['id']>) => {
      const albumToRemoveId = action.payload;
      state.queue = state.queue.filter(
        (album) => album.id !== albumToRemoveId,
      );
    },
    queuePrepend: (state, action: PayloadAction<Album>) => {
      const albumToAdd = action.payload;

      const filtered = state.queue.filter(
        (album) => album.id !== albumToAdd.id,
      );

      state.queue = [albumToAdd, ...filtered];
    },
    queuePop: (state) => {
      const [, ...others] = state.queue;
      state.queue = others;
    },
    queueUpdate: (state, action: PayloadAction<Album>) => {
      const updatedAlbum = action.payload;

      state.queue = state.queue.map(
        (album) => (album.id === updatedAlbum.id) ? updatedAlbum : album,
      );
    },
  },
});

export const { queueAdd, queueRemove, queuePrepend, queuePop, queueUpdate } = queueSlice.actions;

export const selectQueue = (state: RootState) => state.queue.queue;

export const selectQueueFirst = (state: RootState) => {
  const queue = selectQueue(state);
  return (queue.length > 0) ? queue[0]: null;
};

export const isQueued = createSelector(
  [selectQueue, (_state, album) => album],
  (queue, album) => queue.find((q) => q.videoId === album.videoId) !== undefined,
);

export default queueSlice.reducer;

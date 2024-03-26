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

export const { queueAdd, queueRemove, queuePrepend, queuePop } = queueSlice.actions;

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

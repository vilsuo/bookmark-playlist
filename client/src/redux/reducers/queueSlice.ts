import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { Album } from '../../types';
import { RootState } from '../store';
import { AlbumUpdatePayload } from './albums/albumsSlice';

export interface QueueState {
  queue: Album[];
};

export const initialState: QueueState = {
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
    queueUpdate: (state, action: PayloadAction<AlbumUpdatePayload>) => {
      const { id, album } = action.payload;
      state.queue = state.queue.map((a) => (a.id === id) ? album : a);
    },
  },
});

export const { queueAdd, queueRemove, queuePrepend, queuePop, queueUpdate } = queueSlice.actions;


export default queueSlice.reducer;

// SELECTORS

/**
 * Select all queued albums
 * @param state 
 * @returns 
 */
export const selectQueue = (state: RootState) => state.queue.queue;

/**
 * Select the first album in a queue if it exists
 * @param state 
 * @returns 
 */
export const selectQueueFirst = (state: RootState) => {
  const queue = selectQueue(state);
  return (queue.length > 0) ? queue[0]: null;
};

/**
 * Creates a memoized selector for checking if a certain album is in queue
 */
export const selectIsQueued = createSelector(
  [
    selectQueue,
    (_state, id: Album["id"]) => id,
  ],
  (queue, id) => queue.find((album) => album.id === id) !== undefined,
);

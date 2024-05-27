import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { Album, PlayMode } from '../../types';
import { RootState } from '../store';

export interface QueueState {
  queue: Album[];
  playMode: PlayMode;
};

const initialState: QueueState = {
  queue: [],
  playMode: PlayMode.SHUFFLE,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [first, ...others] = state.queue;
      state.queue = others;
    },
    queueUpdate: (state, action: PayloadAction<Album>) => {
      const updatedAlbum = action.payload;

      state.queue = state.queue.map(
        (album) => (album.id === updatedAlbum.id) ? updatedAlbum : album,
      );
    },
    setPlayMode: (state, action: PayloadAction<PlayMode>) => {
      const newPlayMode = action.payload;
      state.playMode = newPlayMode;
    },
  },
});

export const { queueAdd, queueRemove, queuePrepend, queuePop, queueUpdate } = queueSlice.actions;

export const selectQueue = (state: RootState) => state.queue.queue;
export const selectPlayMode = (state: RootState) => state.queue.playMode;

export const selectQueueFirst = (state: RootState) => {
  const queue = selectQueue(state);
  return (queue.length > 0) ? queue[0]: null;
};

export const isQueued = createSelector(
  [selectQueue, (_state, album) => album],
  (queue, album) => queue.find((q) => q.videoId === album.videoId) !== undefined,
);

export default queueSlice.reducer;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Album } from '../../types';
import { RootState } from '../store';

export interface AlbumsState {
  viewing: Album | null;
  playing: Album | null;
};

const initialState: AlbumsState = {
  viewing: null,
  playing: null,
};

type AlbumPayloadAction = PayloadAction<Album | null>;

const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    view: (state, action: AlbumPayloadAction) => {
      const album = action.payload;
      state.viewing = album;
    },
    play: (state, action: AlbumPayloadAction) => {
      const album = action.payload;
      state.playing = album;
    },
  },
});

export const { view, play } = albumsSlice.actions;

export const selectViewing = (state: RootState) => state.albums.viewing;
export const selectPlaying = (state: RootState) => state.albums.playing;

export default albumsSlice.reducer;

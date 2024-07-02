import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { PlayMode } from '../../types';

// Define a type for the slice state
export interface SettingsState {
  autoplay: boolean;
  autoqueue: boolean;
  showVideoDetails: boolean;
  playMode: PlayMode;
}

export const initialState: SettingsState = {
  autoplay: true,
  autoqueue: true,
  showVideoDetails: true,
  playMode: PlayMode.MANUAL,
};

// ADD A MATCHER TO A LISTENER IF PERSISTING!
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleAutoplay: (state) => {
      state.autoplay = !state.autoplay;
    },
    toggleAutoqueue: (state) => {
      state.autoqueue = !state.autoqueue;
    },
    toggleShowVideoDetails: (state) => {
      state.showVideoDetails = !state.showVideoDetails;
    },
    setPlayMode: (state, action: PayloadAction<PlayMode>) => {
      const newPlayMode = action.payload;
      state.playMode = newPlayMode;
    },
  },
});

export const { toggleAutoplay, toggleAutoqueue, toggleShowVideoDetails, setPlayMode } = settingsSlice.actions;

export default settingsSlice.reducer;

// SELECTORS

export const selectAutoplay = (state: RootState) => state.settings.autoplay;

export const selectAutoqueue = (state: RootState) => state.settings.autoqueue;

export const selectShowVideoDetails = (state: RootState) => state.settings.showVideoDetails;

export const selectPlayMode = (state: RootState) => state.settings.playMode;


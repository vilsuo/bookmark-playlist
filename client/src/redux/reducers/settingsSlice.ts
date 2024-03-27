import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define a type for the slice state
export interface SettingsState {
  autoplay: boolean;
  autoqueue: boolean;
  showVideoDetails: boolean;
}

export const initialState: SettingsState = {
  autoplay: false,
  autoqueue: true,
  showVideoDetails: true,
};

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
  },
});

export const { toggleAutoplay, toggleAutoqueue, toggleShowVideoDetails } = settingsSlice.actions;

export const selectAutoplay = (state: RootState) => state.settings.autoplay;
export const selectAutoqueue = (state: RootState) => state.settings.autoqueue;
export const selectShowVideoDetails = (state: RootState) => state.settings.showVideoDetails;

export default settingsSlice.reducer;

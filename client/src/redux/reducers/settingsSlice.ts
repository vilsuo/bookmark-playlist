import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define a type for the slice state
export interface SettingsState {
  autoplay: boolean;
  autoqueue: boolean;
}

const initialState: SettingsState = {
  autoplay: false,
  autoqueue: true,
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
  },
});

export const { toggleAutoplay, toggleAutoqueue } = settingsSlice.actions;

export const selectAutoplay = (state: RootState) => state.settings.autoplay;
export const selectAutoqueue = (state: RootState) => state.settings.autoqueue;

export default settingsSlice.reducer;

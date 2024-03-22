import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define a type for the slice state
interface SettingsState {
  autoplay: boolean;
}

const initialState: SettingsState = {
  autoplay: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleAutoplay: (state) => {
      state.autoplay = !state.autoplay;
    },
  },
});

export const { toggleAutoplay } = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAutoplay = (state: RootState) => state.settings.autoplay;

export default settingsSlice.reducer;

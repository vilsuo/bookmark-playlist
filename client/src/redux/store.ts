import { combineReducers, configureStore, isAnyOf } from '@reduxjs/toolkit';

import settingsReducer, { setPlayMode, toggleAutoplay, toggleAutoqueue, toggleShowVideoDetails } from './reducers/settingsSlice.ts';
import filterReducer from './reducers/filterSlice.ts';

import { loadSettingsState, saveSettingsState } from './localStorage.ts';
import { listenerMiddleware, startAppListening } from './listenerMiddleware.ts';
import albumsSlice from './reducers/albumsSlice.ts';
import queueSlice from './reducers/queueSlice.ts';
import { initialState as initialSettingsState } from './reducers/settingsSlice.ts';
import notificationSlice from './reducers/notificationSlice.ts';

// save settings to local storage
startAppListening({
  matcher: isAnyOf(toggleAutoplay, toggleAutoqueue, toggleShowVideoDetails, setPlayMode),
  effect: (_action, listenerApi) => {
    saveSettingsState(listenerApi.getState().settings);
  },
});

export const preloadedState = {
  settings: {
    // load defaults (only relevant if a new setting has been defined)
    ...initialSettingsState,

    // load saved settings
    ...loadSettingsState(),
  },
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  filters: filterReducer,
  albums: albumsSlice,
  queue: queueSlice,
  notifications: notificationSlice,
});

export const setupStore = (preloadedState?: Partial<RootState>) => configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // NOTE: Since this can receive actions with functions inside,
      // it should go before the serializability check middleware
      .prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export type AppAsyncThunkConfig = {
  getState: () => RootState,
  dispatch: AppDispatch,
  rejectValue: { message: string },
};

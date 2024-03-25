import { combineReducers, configureStore, isAnyOf } from '@reduxjs/toolkit';

import settingsReducer, { toggleAutoplay } from './reducers/settingsSlice.ts';
import filterReducer from './reducers/filterSlice.ts';

import { loadSettingsState, saveSettingsState } from './localStorage.ts';
import { listenerMiddleware, startAppListening } from './listenerMiddleware.ts';

/*
const loggerMiddleware: Middleware<{}, RootState> = storeApi => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', storeApi.getState());
  return result;
};
*/

startAppListening({
  matcher: isAnyOf(toggleAutoplay),
  effect: (_action, listenerApi) => {
    saveSettingsState(listenerApi.getState().settings);
  },
});

const preloadedState = {
  settings: loadSettingsState(),
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  filters: filterReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // NOTE: Since this can receive actions with functions inside,
      // it should go before the serializability check middleware
      .prepend(listenerMiddleware.middleware),

  //.concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;
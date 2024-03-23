import { combineReducers, configureStore } from '@reduxjs/toolkit';

// reducers
import settingsReducer from './reducers/settingsSlice.ts';
import filterReducer from './reducers/filterSlice.ts';

import { loadSettingsState, saveSettingsState } from './localStorage.ts';

const preloadedState = {
  'settings': loadSettingsState(),
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  filters: filterReducer
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  saveSettingsState(store.getState().settings);
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

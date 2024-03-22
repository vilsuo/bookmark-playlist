import { combineReducers, configureStore } from '@reduxjs/toolkit';
import settingsReducer from './reducers/settingsSlice.ts';
import { loadState, saveState } from './localStorage.ts';

const preloadedState = loadState();

const rootReducer = combineReducers({
  settings: settingsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

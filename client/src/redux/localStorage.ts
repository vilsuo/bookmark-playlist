import { SettingsState } from './reducers/settingsSlice';

const SETTINGS_STATE = 'state';

/**
 * Load state from the window local storage
 *
 * @returns
 */
export const loadSettingsState = () => {
  try {
    const serializedState = localStorage.getItem(SETTINGS_STATE);
    if (serializedState === null) {
      console.log('state was not found in local storage');
      return undefined;
    }

    console.log('loaded state', JSON.parse(serializedState));
    return JSON.parse(serializedState);
  } catch (error: unknown) {
    console.log('Error loading state', error);
    return undefined;
  }
};

/**
 * Persist state to the window local storage
 *
 * @param state
 */
export const saveSettingsState = (state: SettingsState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(SETTINGS_STATE, serializedState);
    console.log('saved state', serializedState);
  } catch (error) {
    console.log('Error saving state', error);
  }
};

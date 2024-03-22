import { RootState } from './store';

/**
 * Load state from the window local storage
 * 
 * @returns 
 */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      console.log('state was not found in local storage')

      return undefined;
    }

    console.log('loaded state', JSON.parse(serializedState))

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
export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);

    console.log('saved state', serializedState);

  } catch (error) {
    console.log('Error saving state', error);
  }
};

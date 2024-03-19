import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const { response } = error;
    if (response && response.data && 'message' in response.data) {
      return JSON.stringify(response.data.message);

    } else {
      return 'Unknown axios error';
    }
  } else {
    return 'Unknown error';
  }
};
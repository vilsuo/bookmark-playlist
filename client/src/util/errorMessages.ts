import { AxiosError } from 'axios';
import { isRejectedResponse } from '../redux/reducers/albumsSlice';

const DEFAULT_MESSAGE = 'Unknown error';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const { response } = error;
    if (response && response.data && 'message' in response.data) {
      return response.data.message;
    } else {
      return 'Unknown axios error';
    }
  } else {
    return DEFAULT_MESSAGE;
  }
};

export const getThunkError = (error: unknown) => {
  return isRejectedResponse(error)
    ? error.errorMessage
    : DEFAULT_MESSAGE;
};

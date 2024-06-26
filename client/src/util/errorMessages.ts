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

enum YoutubeEventError {
  // The request contains an invalid parameter value. For example, this error
  // occurs if you specify a video ID that does not have 11 characters, or if
  // the video ID contains invalid characters, such as exclamation points or asterisks.
  INVALID_PARAMETER = 2,

  // The requested content cannot be played in an HTML5 player or another error
  // related to the HTML5 player has occurred.
  HTML5_ERROR = 5,

  // The video requested was not found. This error occurs when a video has been
  // removed (for any reason) or has been marked as private.
  NOT_FOUND = 100,

  // The owner of the requested video does not allow it to be played in embedded
  // players.
  NO_EMBEDDED = 101,

  // This error is the same as 101. It's just a 101 error in disguise!
  NO_EMBEDDED_2 = 150,
};

export const createYoutubeErrorMessage = (data: number) => {
  switch (data) {
    case YoutubeEventError.INVALID_PARAMETER:
      return "The request contains an invalid parameter value";

    case YoutubeEventError.HTML5_ERROR:
      return "Error related to the  HTML5 player has occurred";

    case YoutubeEventError.NOT_FOUND:
      return "The video requested was not found";

    case YoutubeEventError.NO_EMBEDDED:
    case YoutubeEventError.NO_EMBEDDED_2:
      return "The owner of the requested video does not allow it to be played in embedded players";

    default:
      return "Unknown error happened while attempting to play video";
  }
};

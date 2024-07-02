import { ThunkAction, UnknownAction, createSelector } from "@reduxjs/toolkit";
import { Album, PlayMode } from "../../../types";
import { selectSortedAndFilteredAlbums } from "./filterSort";
import { queuePop, selectQueueFirst } from "../queueSlice";
import { selectPlayMode } from "../settingsSlice";
import { selectPlaying, setPlayingAlbum } from "./albumsSlice";
import { RootState } from "../../store";

// SELECTORS

export const selectCanPlayNextAlbum = createSelector(
  selectSortedAndFilteredAlbums,
  selectQueueFirst,
  selectPlayMode,
  selectPlaying,
  (albums, nextAlbumInQueue, playMode, playingAlbum) => {
    // can play next from queue
    if (nextAlbumInQueue) { return true; }

    switch (playMode) {
      case PlayMode.MANUAL: {
        // can only play from queue
        return false;
      }
      case PlayMode.SEQUENCE: {
        // no sequence to play
        if (albums.length === 0) { return false; }

        // playing last album in sequence?
        return playingAlbum
          ? (albums[albums.length - 1].id !== playingAlbum.id)
          : false;
      }
      case PlayMode.SHUFFLE: {
        // only if there are albums
        return (albums.length > 0);
      }
      default:
        playMode satisfies never;
        return false;
    }
  },
);

// THUNKS

/**
 * Play next album.
 * 
 * Queued albums are always prioritized. Othervise, the next album
 * is choosen from the filtered and sorted albums list based on current
 * {@link PlayMode} and the playing album.
 * 
 * @remarks
 * When the play mode is {@link PlayMode.SEQUENCE}, 
 * sequence will start over from the final queued album
 */
export const playNext = (): ThunkAction<
  void,         // Return type of the thunk function
  RootState,    // state type used by getState
  unknown,      // any "extra argument" injected into the thunk
  UnknownAction // known types of actions that can be dispatched
> => (dispatch, getState) => {

  const state = getState();
  const albums = selectSortedAndFilteredAlbums(state);
  const nextAlbumInQueue = selectQueueFirst(state);
  const playMode = selectPlayMode(state);
  const playingAlbum = selectPlaying(state);

  if (nextAlbumInQueue) { 
    // always prioritize queue
    dispatch(setPlayingAlbum(nextAlbumInQueue));
    dispatch(queuePop());

  } else {
    // no albums are queued
    switch (playMode) {
      case PlayMode.MANUAL: {
        dispatch(setPlayingAlbum(null));
        break;
      }
      case PlayMode.SEQUENCE: {
        dispatch(setPlayingAlbum(getNextAlbumInSequence(albums, playingAlbum)));
        break;
      }
      case PlayMode.SHUFFLE: {
        dispatch(setPlayingAlbum(getRandomAlbum(albums)));
        break;
      }
      default:
        playMode satisfies never;
    }
  }
};

/**
 * Select the next album based on the current album
 * 
 * @param albums array to choose from
 * @param album the given album
 * @returns
 * - null if {@link albums} is empty or the {@link album} is the last entity
 *   in {@link albums}.
 * - the first entity in the {@link albums} if {@link album} is not given or
 *   not found in the {@link albums}
 * - the next entity in {@link albums} after the given {@link album} in the
 *   {@link albums} if the {@link album} is found in the {@link albums}
 */
const getNextAlbumInSequence = (albums: Album[], album: Album | null) => {
  // no albums and/or match the filter
  if (!albums.length) { return null; }

  // no album selected, play the first
  if (!album) { return albums[0]; }

  const playingAlbumIdx = albums.findIndex((a) => a.id === album.id);
  if (playingAlbumIdx === -1) {
    // album not found, user likely changed filters...
    return albums[0];

  } else if (playingAlbumIdx === albums.length - 1) {
    // reached the end of the list
    return null;

  } else {
    // return next in sequence
    return albums[playingAlbumIdx + 1];
  }
};

/**
 * Select a random album
 * 
 * @param albums
 * @returns a random entity from {@link albums} if {@link albums} is non-empty
 */
const getRandomAlbum = (albums: Album[]) => albums.length
  ? albums[Math.floor(albums.length * Math.random())]
  : null;

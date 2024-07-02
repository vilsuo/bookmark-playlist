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
 * {@link PlayMode}.
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
 * @param currentAlbum the given album
 * @returns null if album list is empty or the album is the last album;
 * the first album in the list if album is not given or not found in the list;
 * else the album after the given album in the array
 */
const getNextAlbumInSequence = (albums: Album[], currentAlbum: Album | null) => {
  // no albums and/or match the filter
  if (!albums.length) { return null; }

  // no album selected, play the first
  if (!currentAlbum) { return albums[0]; }

  const playingAlbumIdx = albums.findIndex((album) => album.id === currentAlbum.id);
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
 * @param albums array to choose from
 * @returns a random album
 */
const getRandomAlbum = (albums: Album[]) => albums.length
  ? albums[Math.floor(albums.length * Math.random())]
  : null;

import { beforeAll, describe, expect, test } from "@jest/globals";
import { Album, PlayMode } from "../../../types";
import { selectCanPlayNextAlbum } from "./playing";
import { RootState } from "../../store";
import { createAlbumsState, createFilteringAndSortingRootState, createFilterState, createQueueState, createSettingsState } from "../../../../test/creators";
import { albums } from "../../../../test/constants";
import { selectSortedAndFilteredAlbums } from "./filterSort";

const createPlayingNextRootState = ({
  albums, playing, queue, playMode,
}: {
  albums: Album[],
  playing?: Album,
  queue?: Album[],
  playMode: PlayMode,
}): RootState => (
  {
    albums: createAlbumsState({ albums, playing }),
    filters: createFilterState(),
    queue: createQueueState(queue),
    settings: createSettingsState({ playMode }),
  } as RootState
);

describe("Albums slice playing", () => {
  const sortedAndFilteredArrays = [
    albums[1],
    albums[2],
    albums[0],
    albums[3],
    albums[4],
  ];

  const middleInSequence = sortedAndFilteredArrays[1];
  const lastInSequence = sortedAndFilteredArrays[sortedAndFilteredArrays.length - 1];

  beforeAll(() => {
    const state = createFilteringAndSortingRootState({ albums });
    const result = selectSortedAndFilteredAlbums(state);

    expect(result).toStrictEqual(sortedAndFilteredArrays);
  });

  describe("selectors", () => {
    describe("selectCanPlayNextAlbum", () => {
      describe(PlayMode.MANUAL, () => {
        const playMode = PlayMode.MANUAL;

        test("should return true when the queue is not empty", () => {
          const queue: Album[] = [albums[0]];
          const state = createPlayingNextRootState({
            albums,
            queue,
            playMode,
          });
          const result = selectCanPlayNextAlbum(state);
          expect(result).toBe(true);
        });

        test("should return false when the queue is empty", () => {
          const queue: Album[] = [];
          const state = createPlayingNextRootState({
            albums,
            queue,
            playMode,
          });
          const result = selectCanPlayNextAlbum(state);
          expect(result).toBe(false);
        });
      });

      describe(PlayMode.SEQUENCE, () => {
        const playMode = PlayMode.SEQUENCE;

        describe("when the queue is empty", () => {
          const queue: Album[] = [];

          test("should return true when playing a middle album", () => {
            const state = createPlayingNextRootState({
              albums,
              playing: middleInSequence,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
  
          test("should return false when playing the last album", () => {
            const state = createPlayingNextRootState({
              albums,
              playing: lastInSequence,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(false);
          });
  
          test("should return false when there are no albums", () => {
            const empty: Album[] = [];
            const state = createPlayingNextRootState({
              albums: empty,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(false);
          });
        });

        describe("when the queue is not empty", () => {
          const queue = [albums[0]];

          test("should return true when playing a middle album", () => {
            const state = createPlayingNextRootState({
              albums,
              playing: middleInSequence,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
  
          test("should return true when playing the last album", () => {
            const state = createPlayingNextRootState({
              albums,
              playing: lastInSequence,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
  
          test("should return true when there are no albums", () => {
            const empty: Album[] = [];
            const state = createPlayingNextRootState({
              albums: empty,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
        });
      });

      describe(PlayMode.SHUFFLE, () => {
        const playMode = PlayMode.SHUFFLE;

        describe("when the queue is empty", () => {
          const queue: Album[] = [];

          test("should return true when playing a middle album", () => {
            const state = createPlayingNextRootState({
              albums,
              playing: middleInSequence,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
  
          test("should return true when playing the last album", () => {
            const state = createPlayingNextRootState({
              albums,
              playing: lastInSequence,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
  
          test("should return false when there are no albums", () => {
            const empty: Album[] = [];
            const state = createPlayingNextRootState({
              albums: empty,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(false);
          });
        });

        describe("when the queue is not empty", () => {
          const queue = [albums[0]];

          test("should return true when playing a middle album", () => {
            const state = createPlayingNextRootState({
              albums,
              playing: middleInSequence,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
  
          test("should return true when playing the last album", () => {
            const state = createPlayingNextRootState({
              albums,
              playing: lastInSequence,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
  
          test("should return true when there are no albums", () => {
            const empty: Album[] = [];
            const state = createPlayingNextRootState({
              albums: empty,
              queue,
              playMode,
            });
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
        });
      });

      test("should not compute again with the same state", () => {
        const queue: Album[] = [];
        const state = createPlayingNextRootState({
          albums,
          queue,
          playMode: PlayMode.MANUAL,
        });

        selectCanPlayNextAlbum.resetRecomputations();
        selectCanPlayNextAlbum(state);
        expect(selectCanPlayNextAlbum.recomputations()).toBe(1);
        selectCanPlayNextAlbum(state);
        expect(selectCanPlayNextAlbum.recomputations()).toBe(1);
      });

      test("should recompute with a new state", () => {
        const queue: Album[] = [];

        const firstState = createPlayingNextRootState({
          albums,
          queue,
          playMode: PlayMode.MANUAL,
        });

        // change playmode
        const secondState = createPlayingNextRootState({
          albums,
          queue,
          playMode: PlayMode.SHUFFLE,
        });

        selectCanPlayNextAlbum.resetRecomputations();

        selectCanPlayNextAlbum(firstState);
        expect(selectCanPlayNextAlbum.recomputations()).toBe(1);

        selectCanPlayNextAlbum(secondState);
        expect(selectCanPlayNextAlbum.recomputations()).toBe(2);
      });
    });
  });

  /*
  describe("thunks", () => {
    describe("playNext", () => {

    });
  });
  */
});

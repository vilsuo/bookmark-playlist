import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Album, PlayMode } from "../../../types";
import { playNext, selectCanPlayNextAlbum } from "./playing";
import { RootState, setupStore } from "../../store";
import { createDefaultAlbumsState, createAlbumsFiltersRootState, createDefaultFiltersState, createDefaultQueueState, createSettingsState } from "../../../../test/state";
import { albums } from "../../../../test/constants";
import { selectSortedAndFilteredAlbums } from "./filterSort";
import { selectPlaying } from "./albumsSlice";
import { selectQueueFirst } from "../queueSlice";

const createPlayingNextTestRootState = ({
  albums = [], playing = null, queue = [], playMode,
}: {
  albums: Album[],
  playing?: Album | null,
  queue?: Album[],
  playMode: PlayMode,
}): RootState => (
  {
    albums: createDefaultAlbumsState({ albums, playing }),
    queue: createDefaultQueueState({ queue }),
    settings: createSettingsState({ playMode }),
    filters: createDefaultFiltersState(),
  } as RootState
);

describe("Albums slice playing", () => {
  // pre sorted and filtered albums
  const sortedAndFilteredAlbums = [
    albums[1],
    albums[2],
    albums[0],
    albums[3],
    albums[4],
  ];

  const firstInSequence = sortedAndFilteredAlbums[0];
  const middleInSequence = sortedAndFilteredAlbums[1];
  const afterMiddleInSequence = sortedAndFilteredAlbums[2];
  const lastInSequence = sortedAndFilteredAlbums[sortedAndFilteredAlbums.length - 1];

  // check that tests are actually expecting correct ordering
  beforeAll(() => {
    const state = createAlbumsFiltersRootState({ albums });
    const result = selectSortedAndFilteredAlbums(state);

    expect(result).toStrictEqual(sortedAndFilteredAlbums);
  });

  describe("selectors", () => {
    const queue = [lastInSequence, firstInSequence];

    describe("selectCanPlayNextAlbum", () => {
      describe(PlayMode.MANUAL, () => {
        const playMode = PlayMode.MANUAL;

        describe("when the queue is empty", () => {
          test("should return false when album is not being played", () => {
            const state = createPlayingNextTestRootState({
              albums: sortedAndFilteredAlbums,
              playMode,
            });
    
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(false);
          });

          test("should return false when album is being played", () => {
            const state = createPlayingNextTestRootState({
              albums: sortedAndFilteredAlbums,
              playing: firstInSequence,
              playMode,
            });
    
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(false);
          });
        });

        describe("when the queue is not empty", () => {
          test("should return true when album is not being played", () => {
            const state = createPlayingNextTestRootState({
              albums: sortedAndFilteredAlbums,
              queue,
              playMode,
            });
    
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });

          test("should return true when album is being played", () => {
            const state = createPlayingNextTestRootState({
              albums: sortedAndFilteredAlbums,
              playing: middleInSequence,
              queue,
              playMode,
            });
    
            const result = selectCanPlayNextAlbum(state);
            expect(result).toBe(true);
          });
        });
      });

      describe(PlayMode.SEQUENCE, () => {
        const playMode = PlayMode.SEQUENCE;

        describe("when the queue is empty", () => {
          describe("when album is not being played", () => {
            test("should return false when there are albums", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(false);
            });
    
            test("should return false when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(false);
            });
          });

          describe("when album is being played", () => {
            test("should return true when playing a middle album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: middleInSequence,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return false when playing the last album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: lastInSequence,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(false);
            });
    
            test("should return false when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playing: firstInSequence,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(false);
            });

            test("should return true when the playing album is not in the albums list", () => {
              const [ first, second, ...rest ] = sortedAndFilteredAlbums;

              const state = createPlayingNextTestRootState({
                albums: [ first, ...rest ], // also sorted and filtered
                playing: second,
                playMode,
              });
  
              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
          });
        });

        describe("when the queue is not empty", () => {
          describe("when album is not being played", () => {
            test("should return true when there are albums", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return true when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
          });

          describe("when album is being played", () => {
            test("should return true when playing a middle album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: middleInSequence,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return true when playing the last album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: lastInSequence,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return true when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playing: firstInSequence,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });

            test("should return true when the playing album is not in the albums list", () => {
              const [ first, second, ...rest ] = sortedAndFilteredAlbums;
  
              const state = createPlayingNextTestRootState({
                albums: [ first, ...rest ], // also sorted and filtered
                playing: second,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
          });
        });
      });

      describe(PlayMode.SHUFFLE, () => {
        const playMode = PlayMode.SHUFFLE;

        describe("when the queue is empty", () => {
          describe("when album is not being played", () => {
            test("should return true when there are albums", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return false when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(false);
            });
          });

          describe("when album is being played", () => {
            test("should return true when playing a middle album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: middleInSequence,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return true when playing the last album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: lastInSequence,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return false when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playing: firstInSequence,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(false);
            });

            test("should return true when the playing album is not in the albums list", () => {
              const [ first, second, ...rest ] = sortedAndFilteredAlbums;

              const state = createPlayingNextTestRootState({
                albums: [ first, ...rest ], // also sorted and filtered
                playing: second,
                playMode,
              });
  
              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
          });
        });

        describe("when the queue is not empty", () => {
          describe("when album is not being played", () => {
            test("should return true when there are albums", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return true when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
          });

          describe("when album is being played", () => {
            test("should return true when playing a middle album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: middleInSequence,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return true when playing the last album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: lastInSequence,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
    
            test("should return true when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playing: firstInSequence,
                queue,
                playMode,
              });

              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });

            test("should return true when the playing album is not in the albums list", () => {
              const [ first, second, ...rest ] = sortedAndFilteredAlbums;

              const state = createPlayingNextTestRootState({
                albums: [ first, ...rest ], // also sorted and filtered
                playing: second,
                queue,
                playMode,
              });
  
              const result = selectCanPlayNextAlbum(state);
              expect(result).toBe(true);
            });
          });
        });
      });

      test("should not compute again with the same state", () => {
        const queue: Album[] = [];
        const state = createPlayingNextTestRootState({
          albums: sortedAndFilteredAlbums,
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

        const firstState = createPlayingNextTestRootState({
          albums: sortedAndFilteredAlbums,
          queue,
          playMode: PlayMode.MANUAL,
        });

        // change playmode
        const secondState = createPlayingNextTestRootState({
          albums: sortedAndFilteredAlbums,
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

  describe("thunks", () => {
    describe("playNext", () => {
      const queue = [middleInSequence, lastInSequence];
      const firstInQueue = queue[0];

      describe(PlayMode.MANUAL, () => {
        const playMode = PlayMode.MANUAL;

        describe("when the queue is empty", () => {
          test("should play null when album is not being played", () => {
            const state = createPlayingNextTestRootState({
              albums: sortedAndFilteredAlbums,
              playMode,
            });
  
            const store = setupStore(state);
            store.dispatch(playNext());
  
            const result = selectPlaying(store.getState());
            expect(result).toBe(null);
          });

          test("should play null when album is being played", () => {
            const state = createPlayingNextTestRootState({
              albums: sortedAndFilteredAlbums,
              playing: firstInSequence,
              playMode,
            });
    
            const store = setupStore(state);
            store.dispatch(playNext());
    
            const result = selectPlaying(store.getState());
            expect(result).toBe(null);
          });
        });

        describe("when the queue is not empty", () => {
          const queue = [lastInSequence, middleInSequence];

          let store: ReturnType<typeof setupStore>;
          
          // test that queue is popped
          afterEach(() => {
            const queueFirst = selectQueueFirst(store.getState());
            expect(queueFirst).toStrictEqual(queue[1]);
          });

          test("should play the first album in the queue when album is not being played", () => {
            const state = createPlayingNextTestRootState({
              albums: sortedAndFilteredAlbums,
              queue,
              playMode,
            });
  
            store = setupStore(state);
            store.dispatch(playNext());
  
            const result = selectPlaying(store.getState());
            expect(result).toStrictEqual(queue[0]);
          });

          test("should play the first album in the queue when album is being played", () => {
            const state = createPlayingNextTestRootState({
              albums: sortedAndFilteredAlbums,
              playing: firstInSequence,
              queue,
              playMode,
            });
  
            store = setupStore(state);
            store.dispatch(playNext());
  
            const result = selectPlaying(store.getState());
            expect(result).toStrictEqual(queue[0]);
          });
        });
      });

      describe(PlayMode.SEQUENCE, () => {
        const playMode = PlayMode.SEQUENCE;

        describe("when the queue is empty", () => {
          describe("when album is not being played", () => {
            test("should play the first album when there are albums", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playMode,
              });
    
              const store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInSequence);
            });

            test("should play null when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playMode,
              });
    
              const store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toBe(null);
            });
          });

          describe("when album is being played", () => {
            test("should play the album after the current one playing", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: middleInSequence,
                playMode,
              });
  
              const store = setupStore(state);
              store.dispatch(playNext());
  
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(afterMiddleInSequence);
            });
    
            test("should play null when playing the last album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: lastInSequence,
                playMode,
              });
  
              const store = setupStore(state);
              store.dispatch(playNext());
  
              const result = selectPlaying(store.getState());
              expect(result).toBe(null);
            });
    
            test("should play null when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playing: middleInSequence,
                playMode,
              });
  
              const store = setupStore(state);
              store.dispatch(playNext());
  
              const result = selectPlaying(store.getState());
              expect(result).toBe(null);
            });

            test("should play the first album when the playing album is not in the albums list", () => {
              const [ first, second, ...rest ] = sortedAndFilteredAlbums;

              const state = createPlayingNextTestRootState({
                albums: [ first, ...rest ], // also sorted and filtered
                playing: second,
                playMode,
              });
  
              const store = setupStore(state);
              store.dispatch(playNext());
  
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInSequence);
            });
          });
        });

        describe("when the queue is not empty", () => {
          let store: ReturnType<typeof setupStore>;
          
          // test that queue is popped
          afterEach(() => {
            const queueFirst = selectQueueFirst(store.getState());
            expect(queueFirst).toStrictEqual(queue[1]);
          });

          describe("when album is not being played", () => {
            test("should play the first album in the queue when there are albums", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                queue,
                playMode,
              });

              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
    
            test("should play the first album in the queue when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                queue,
                playMode,
              });

              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
          });

          describe("when album is being played", () => {
            test("should play the first album in the queue when playing an album in the middle of the albums list", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: middleInSequence,
                queue,
                playMode,
              });
    
              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
      
            test("should play the first album in the queue when playing the last album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: lastInSequence,
                queue,
                playMode,
              });
    
              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
      
            test("should play the first album in the queue when playing an album and there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playing: middleInSequence,
                queue,
                playMode,
              });
    
              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
  
            test("should play the first album in the queue when the playing album is not in the albums list", () => {
              const [ first, second, ...rest ] = sortedAndFilteredAlbums;
  
              const state = createPlayingNextTestRootState({
                albums: [ first, ...rest ], // also sorted and filtered
                playing: second,
                queue,
                playMode,
              });
    
              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
          });
        });
      });

      describe(PlayMode.SHUFFLE, () => {
        const playMode = PlayMode.SHUFFLE;

        // mock to always return the first album
        const randomAlbum = sortedAndFilteredAlbums[0];

        beforeEach(() => {
          jest.spyOn(global.Math, 'random').mockReturnValue(0);
        });
      
        afterEach(() => {
          jest.spyOn(global.Math, 'random').mockRestore();
        });

        describe("when the queue is empty", () => {
          describe("when album is not being played", () => {
            test("should play a random album when there are albums", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playMode,
              });

              const store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(randomAlbum);
            });
    
            test("should play null when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playMode,
              });

              const store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toBe(null);
            });
          });

          describe("when album is being played", () => {
            test("should play a random album when playing a middle album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: middleInSequence,
                playMode,
              });

              const store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(randomAlbum);
            });
    
            test("should play a random album when the last album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: lastInSequence,
                playMode,
              });

              const store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(randomAlbum);
            });
    
            test("should play null when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playing: firstInSequence,
                playMode,
              });

              const store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toBe(null);
            });

            test("should play a random album when the playing album is not in the albums list", () => {
              const [ first, second, ...rest ] = sortedAndFilteredAlbums;

              const state = createPlayingNextTestRootState({
                albums: [ first, ...rest ], // also sorted and filtered
                playing: second,
                playMode,
              });
  
              const store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(randomAlbum);
            });
          });
        });

        describe("when the queue is not empty", () => {
          let store: ReturnType<typeof setupStore>;

          // test that queue is popped
          afterEach(() => {
            const queueFirst = selectQueueFirst(store.getState());
            expect(queueFirst).toStrictEqual(queue[1]);
          });
          
          describe("when album is not being played", () => {
            test("should play the first album in the queue when there are albums", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                queue,
                playMode,
              });

              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
    
            test("should play the first album in the queue when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                queue,
                playMode,
              });

              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
          });

          describe("when album is being played", () => {
            test("should play the first album in the queue when playing a middle album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: middleInSequence,
                queue,
                playMode,
              });

              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
    
            test("should play the first album in the queue when playing the last album", () => {
              const state = createPlayingNextTestRootState({
                albums: sortedAndFilteredAlbums,
                playing: lastInSequence,
                queue,
                playMode,
              });

              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
    
            test("should play the first album in the queue when there are no albums", () => {
              const empty: Album[] = [];
              const state = createPlayingNextTestRootState({
                albums: empty,
                playing: firstInSequence,
                queue,
                playMode,
              });

              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });

            test("should play the first album in the queue when the playing album is not in the albums list", () => {
              const [ first, second, ...rest ] = sortedAndFilteredAlbums;

              const state = createPlayingNextTestRootState({
                albums: [ first, ...rest ], // also sorted and filtered
                playing: second,
                queue,
                playMode,
              });
  
              store = setupStore(state);
              store.dispatch(playNext());
    
              const result = selectPlaying(store.getState());
              expect(result).toStrictEqual(firstInQueue);
            });
          });
        });
      });
    });
  });
});

import { beforeEach, describe, expect, test } from "@jest/globals";
import reducer, { queueAdd, queuePop, queuePrepend, queueRemove, queueUpdate, selectIsQueued, selectQueueFirst } from "./queueSlice";
import { albums, newAlbumValues } from "../../../test/constants";
import { Album } from "../../types";
import { createDefaultQueueState, createDefaultQueueRootState } from "../../../test/state";

const createQueueTestState = (queue: Album[] = []) =>
  createDefaultQueueState({ queue });

const createQueueTestRootState = (queue: Album[] = []) =>
  createDefaultQueueRootState({ queue });

describe("Queue slice", () => {
  describe("reducers", () => {
    describe("queueAdd", () => {
      const [ toBeQueued, ...queue ] = albums;

      describe("album is not in the queue", () => {
        test("should add the album to the queue", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queueAdd(toBeQueued));
  
          expect(currentState.queue).toContainEqual(toBeQueued);
          expect(currentState.queue).toHaveLength(previousState.queue.length + 1);
        });

        test("should add the album to the end of the queue", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queueAdd(toBeQueued));
  
          expect(currentState.queue).toHaveLength(previousState.queue.length + 1);
          expect(currentState.queue[currentState.queue.length - 1]).toBe(toBeQueued);
        });

        test("should not shift the positions any queued albums", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queueAdd(toBeQueued));
  
          expect(currentState.queue.slice(0, currentState.queue.length - 1))
            .toStrictEqual(previousState.queue);
        });
      });

      describe("album is already in the queue", () => {
        const idx = 1;
        const toBeReQueued = queue[idx];

        test("should not add any albums", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queueAdd(toBeReQueued));
  
          expect(currentState.queue).toHaveLength(previousState.queue.length);
        });

        test("should move the album to the end", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queueAdd(toBeReQueued));
  
          expect(currentState.queue[idx]).not.toBe(toBeReQueued);
          expect(currentState.queue[currentState.queue.length - 1]).toBe(toBeReQueued);
        });

        test("should not shift the positions of earlier queued albums", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queueAdd(toBeReQueued));

          expect(currentState.queue.slice(0, idx))
            .toStrictEqual(previousState.queue.slice(0, idx));
        });

        test("should shift the positions of later queued albums", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queueAdd(toBeReQueued));

          expect(currentState.queue.slice(idx, currentState.queue.length - 1))
            .toStrictEqual(previousState.queue.slice(idx + 1));
        });
      });
    });

    describe("queueRemove", () => {
      const queue = albums;

      const idx = 1;
      const toBeReQueued = queue[idx];

      test("should remove the album from queue", () => {
        const previousState = createQueueTestState(queue);
        const currentState = reducer(previousState, queueRemove(toBeReQueued.id));

        expect(currentState.queue).not.toContainEqual(toBeReQueued);
        expect(currentState.queue).toHaveLength(previousState.queue.length - 1);
      });

      test("should not shift the positions of earlier queued items", () => {
        const previousState = createQueueTestState(queue);

        const currentState = reducer(previousState, queueRemove(toBeReQueued.id));

        expect(currentState.queue.slice(0, idx))
          .toStrictEqual(previousState.queue.slice(0, idx));
      });

      test("should shift the positions of later queued items", () => {
        const previousState = createQueueTestState(queue);

        const currentState = reducer(previousState, queueRemove(toBeReQueued.id));

        expect(currentState.queue.slice(idx))
          .toStrictEqual(previousState.queue.slice(idx + 1));
      });
    });

    describe("queuePrepend", () => {
      const [ toBeQueued, ...queue ] = albums;

      const idx = 1;
      const toBeReQueued = queue[idx];

      describe("album is not in the queue", () => {
        test("should add the album to the queue", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queuePrepend(toBeQueued));
  
          expect(currentState.queue).toContainEqual(toBeReQueued);
          expect(currentState.queue).toHaveLength(previousState.queue.length + 1);
        });

        test("should add the album to the beginning of the queue", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queuePrepend(toBeQueued));
  
          expect(currentState.queue[0]).toBe(toBeQueued);
        });

        test("should shift the positions all all queued albums", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queuePrepend(toBeQueued));
  
          expect(currentState.queue.slice(1)).toStrictEqual(previousState.queue);
        });
      });

      describe("album is already in the queue", () => {
        test("should not add any albums to the queue", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queuePrepend(toBeReQueued));
  
          expect(currentState.queue).toHaveLength(previousState.queue.length);
        });

        test("should move album to the beginning of the queue", () => {
          const previousState = createQueueTestState(queue);

          const currentState = reducer(previousState, queuePrepend(toBeReQueued));
  
          expect(currentState.queue[0]).toBe(toBeReQueued);
          expect(currentState.queue[idx]).not.toBe(toBeReQueued);
        });

        test("should shift the positions of earlier queued items", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queuePrepend(toBeReQueued));
  
          expect(currentState.queue.slice(1, idx + 1))
            .toStrictEqual(previousState.queue.slice(0, idx));
        });
  
        test("should shift the positions of later queued items", () => {
          const previousState = createQueueTestState(queue);
  
          const currentState = reducer(previousState, queuePrepend(toBeReQueued));
  
          expect(currentState.queue.slice(idx + 1))
            .toStrictEqual(previousState.queue.slice(idx + 1));
        });
      });
    });

    describe("queuePop", () => {
      const queue = albums;

      test("should remove one album from the queue", () => {
        const previousState = createQueueTestState(queue);

        const currentState = reducer(previousState, queuePop());

        expect(currentState.queue).toHaveLength(previousState.queue.length - 1);
      });

      test("should remove the first album from the queue", () => {
        const previousState = createQueueTestState(queue);

        const currentState = reducer(previousState, queuePop());

        expect(currentState.queue).not.toContainEqual(queue[0]);
      });

      test("should shift the positions of all albums in the queue", () => {
        const previousState = createQueueTestState(queue);
        const currentState = reducer(previousState, queuePop());

        expect(currentState.queue).toStrictEqual(previousState.queue.slice(1));
      });

      test("should empty the queue if there is a single album", () => {
        const queue = [albums[0]];
        const previousState = createQueueTestState(queue);

        const currentState = reducer(previousState, queuePop());

        expect(currentState.queue).toHaveLength(0);
      });

      test("should not change the state when the queue is empty", () => {
        const previousState = createQueueTestState();

        const currentState = reducer(previousState, queuePop());

        expect(previousState).toStrictEqual(currentState);
      });
    });

    describe("queueUpdate", () => {
      const queue = albums;

      const idx = 1;
      const toBeUpdated = queue[idx];

      const { id, addDate } = toBeUpdated;
      const newAlbum: Album = { id, addDate, ...newAlbumValues };

      test("should update the album in the queue", () => {
        const previousState = createQueueTestState(queue);

        const currentState = reducer(previousState, queueUpdate({
          id: toBeUpdated.id,
          album: newAlbum,
        }));

        expect(currentState.queue).toContainEqual(newAlbum);
        expect(currentState.queue).not.toContainEqual(toBeUpdated);

        expect(currentState.queue[idx]).toBe(newAlbum);
      });

      test("should not effect other albums in the queue", () => {
        const previousState = createQueueTestState(queue);

        const currentState = reducer(previousState, queueUpdate({
          id: toBeUpdated.id,
          album: newAlbum,
        }));

        // earlier
        expect(currentState.queue.slice(0, idx)).toStrictEqual(
          previousState.queue.slice(0, idx)
        );

        // later
        expect(currentState.queue.slice(idx + 1)).toStrictEqual(
          previousState.queue.slice(idx + 1)
        );
      });
    });
  });

  describe("selectors", () => {
    const [ notQueued, ...queue ] = albums;
    const queued = queue[1];

    describe("selectQueueFirst", () => {
      test("should return null when the queue is empty", () => {
        const state = createQueueTestRootState();

        const result = selectQueueFirst(state);
        expect(result).toBe(null);
      });

      test("should return the first album when queue is not empty", () => {
        const state = createQueueTestRootState(queue);

        const result = selectQueueFirst(state);
        expect(result).toStrictEqual(queue[0]);
      });
    });

    describe("selectIsQueued", () => {
      test("should return true if album is in queue", () => {
        const state = createQueueTestRootState(queue);

        const result = selectIsQueued(state, queued.id);
        expect(result).toBe(true);
      });

      test("should return false if album is not in queue", () => {
        const state = createQueueTestRootState(queue);

        const result = selectIsQueued(state, notQueued.id);
        expect(result).toBe(false);
      });

      describe("recomputations", () => {
        beforeEach(() => {
          selectIsQueued.memoizedResultFunc.clearCache();
          selectIsQueued.resetRecomputations();
        });

        test("should not compute again with the same state", () => {
          const state = createQueueTestRootState(queue);

          selectIsQueued(state, queued.id);
          expect(selectIsQueued.recomputations()).toBe(1);
          
          selectIsQueued(state, queued.id);
          expect(selectIsQueued.recomputations()).toBe(1);
        });

        test("should recompute with a new state", () => {
          const firstState = createQueueTestRootState(queue);
          const secondState = createQueueTestRootState([ ...queue, notQueued ]);

          selectIsQueued(firstState, queued.id);
          expect(selectIsQueued.recomputations()).toBe(1);

          selectIsQueued(secondState, queued.id);
          expect(selectIsQueued.recomputations()).toBe(2);
        });

        test("should recompute with a new album id", () => {
          const state = createQueueTestRootState(queue);

          selectIsQueued(state, queued.id);
          expect(selectIsQueued.recomputations()).toBe(1);

          selectIsQueued(state, notQueued.id);
          expect(selectIsQueued.recomputations()).toBe(2);
        });
      });
    });
  });
});

import { describe, expect, test } from "@jest/globals";
import reducer, { QueueState, queueAdd, queuePop, queuePrepend, queueRemove, queueUpdate, selectIsQueued, selectQueueFirst } from "./queueSlice";
import { albums, newAlbumValues } from "../../../test/constants";
import { Album } from "../../types";
import { RootState } from "../store";
import { createQueueState } from "../../../test/creators";

const createQueueRootState = (queue: Album[]): RootState => (
  { queue: createQueueState(queue) } as RootState
);

const getAlbumPosition = (state: QueueState, id: Album["id"]) =>
  state.queue.map(a => a.id).indexOf(id);

describe("Queue slice", () => {
  describe("reducers", () => {
    describe("queueAdd", () => {
      test("should add to an empty queue", () => {
        const album = albums[0];
        const previousState = createQueueState([]);

        const currentState = reducer(previousState, queueAdd(album));
        expect(currentState.queue).toStrictEqual([album]);
      });

      test("should add to the end of the queue", () => {
        const [ first, second ] = albums;
        const previousState = createQueueState([first]);

        const currentState = reducer(previousState, queueAdd(second));
        expect(getAlbumPosition(currentState, first.id)).toBe(0);
        expect(getAlbumPosition(currentState, second.id)).toBe(1);

        // one is added
        expect(previousState.queue).toHaveLength(currentState.queue.length - 1);
      });

      test("should move the album to the and if it is already queued", () => {
        const [ first, second ] = albums;
        const previousState = createQueueState([ first, second ]);

        const currentState =  reducer(previousState, queueAdd(first));
        expect(getAlbumPosition(currentState, second.id)).toBe(0);
        expect(getAlbumPosition(currentState, first.id)).toBe(1);

        // no extra albums are added
        expect(previousState.queue).toHaveLength(currentState.queue.length);
      });
    });

    describe("queueRemove", () => {
      test("should remove album from queue", () => {
        const [ first, second, third ] = albums;
        const previousState = createQueueState([ first, second, third ]);
        const currentState =  reducer(previousState, queueRemove(second.id));

        expect(getAlbumPosition(currentState, first.id)).toBe(0);
        expect(getAlbumPosition(currentState, second.id)).toBe(-1);
        expect(getAlbumPosition(currentState, third.id)).toBe(1);

        // one is removed
        expect(previousState.queue).toHaveLength(currentState.queue.length + 1);
      });
    });

    describe("queuePrepend", () => {
      test("should add to the beginning of the queue", () => {
        const [ first, second, third ] = albums;
        const previousState = createQueueState([ first, second ]);
        const currentState =  reducer(previousState, queuePrepend(third));

        expect(getAlbumPosition(currentState, first.id)).toBe(1);
        expect(getAlbumPosition(currentState, second.id)).toBe(2);
        expect(getAlbumPosition(currentState, third.id)).toBe(0);

        // one is added
        expect(previousState.queue).toHaveLength(currentState.queue.length - 1);
      });

      test("should move album to the beginning if it is already queued", () => {
        const [ first, second, third ] = albums;
        const previousState = createQueueState([ first, second, third ]);
        const currentState =  reducer(previousState, queuePrepend(second));

        expect(getAlbumPosition(currentState, first.id)).toBe(1);
        expect(getAlbumPosition(currentState, second.id)).toBe(0);
        expect(getAlbumPosition(currentState, third.id)).toBe(2);

        // no extra albums are added
        expect(previousState.queue).toHaveLength(currentState.queue.length);
      });
    });

    describe("queuePop", () => {
      test("should remove from the beginning", () => {
        const [ first, second, third ] = albums;
        const previousState = createQueueState([ first, second, third ]);
        const currentState =  reducer(previousState, queuePop());
        
        expect(getAlbumPosition(currentState, first.id)).toBe(-1);
        expect(getAlbumPosition(currentState, second.id)).toBe(0);
        expect(getAlbumPosition(currentState, third.id)).toBe(1);

        // one is removed
        expect(previousState.queue).toHaveLength(currentState.queue.length + 1);
      });

      test("should empty the queue if there is a single album", () => {
        const [album] = albums;
        const previousState = createQueueState([album]);
        const currentState =  reducer(previousState, queuePop());

        expect(currentState.queue).toHaveLength(0);
      });

      test("should not change the state when the queue is empty", () => {
        const previousState = createQueueState([]);
        const currentState =  reducer(previousState, queuePop());

        expect(previousState).toStrictEqual(currentState);
      });
    });

    describe("queueUpdate", () => {
      test("should update the album", () => {
        const [ first, second, third ] = albums;
        const previousState = createQueueState([ first, second, third ]);

        const { id, addDate } = second;
        const newAlbum: Album = { id, addDate, ...newAlbumValues };

        const currentState = reducer(previousState, queueUpdate(newAlbum));

        // updated album values are changed
        expect(currentState.queue[1]).toStrictEqual(newAlbum);
        expect(currentState.queue[1]).not.toStrictEqual(second);

        // other albums remain unchanged
        expect(currentState.queue[0]).toStrictEqual(first);
        expect(currentState.queue[2]).toStrictEqual(third);

        // queue length remains unchanged
        expect(previousState.queue).toHaveLength(currentState.queue.length);
      });
    });
  });

  describe("selectors", () => {
    describe("selectQueueFirst", () => {
      test("should not return an album when queue is empty", () => {
        const state = createQueueRootState([]);
        const result = selectQueueFirst(state);
        expect(result).toBe(null);
      });

      test("should return the first album if queue is not empty", () => {
        const [ first, second ] = albums;
        const state = createQueueRootState([first, second]);
        const result = selectQueueFirst(state);
        expect(result).toStrictEqual(first);
      });
    });

    describe("selectIsQueued", () => {
      const [ first, second, third ] = albums;

      test("should return true if album is in queue", () => {
        const state = createQueueRootState([first, second, third]);
        const result = selectIsQueued(state, second.id);
        expect(result).toBeTruthy();
      });

      test("should return false if album is not in queue", () => {
        const state = createQueueRootState([first, second]);
        const result = selectIsQueued(state, third.id);
        expect(result).toBeFalsy();
      });

      test("should not compute again with the same state", () => {
        const state = createQueueRootState([first]);

        selectIsQueued.resetRecomputations();
        selectIsQueued(state, first.id);
        expect(selectIsQueued.recomputations()).toBe(1);
        selectIsQueued(state, first.id);
        expect(selectIsQueued.recomputations()).toBe(1);
      });

      test("should recompute with a new state", () => {
        const state = createQueueRootState([first]);

        selectIsQueued.resetRecomputations();
        selectIsQueued(state, first.id);
        expect(selectIsQueued.recomputations()).toBe(1);
        selectIsQueued(state, second.id);
        expect(selectIsQueued.recomputations()).toBe(2);
      });
    });
  });
});

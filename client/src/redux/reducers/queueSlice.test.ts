import { describe, expect, test } from "@jest/globals";
import reducer, { QueueState, queueAdd, queuePop, queuePrepend, queueRemove, queueUpdate } from "./queueSlice";
import { albums, newAlbumValues } from "../../../test/constants";
import { Album } from "../../types";

const createQueueState = (albums: Album[]): QueueState => {
  return { queue: albums, };
};

const getQueueFromState = (state: QueueState) => state.queue;

/**
 * 
 * @param state 
 * @param album 
 * @returns index of given album in the queue state, or -1 if it can not be found
 */
const getAlbumPosition = (state: QueueState, id: Album["id"]): number => {
  return state.queue.map(a => a.id).indexOf(id);
};

describe("Queue slice", () => {
  describe("add", () => {
    test("can add album to an empty queue", () => {
      const previousState = createQueueState([]);

      const album = albums[0];
      const currentState =  reducer(previousState, queueAdd(album));
      expect(getQueueFromState(currentState))
        .toStrictEqual([album]);
    });

    test("album is added to to end of the queue", () => {
      const [ first, second ] = albums;
      const previousState = createQueueState([first]);

      const currentState = reducer(previousState, queueAdd(second));
      expect(getAlbumPosition(currentState, first.id)).toBe(0);
      expect(getAlbumPosition(currentState, second.id)).toBe(1);

      // one is added
      expect(getQueueFromState(previousState))
        .toHaveLength(getQueueFromState(currentState).length - 1);
    });

    test("adding album again to a queue moves it last", () => {
      const [ first, second ] = albums;
      const previousState = createQueueState([ first, second ]);

      const currentState =  reducer(previousState, queueAdd(first));
      expect(getAlbumPosition(currentState, second.id)).toBe(0);
      expect(getAlbumPosition(currentState, first.id)).toBe(1);

      // no extra albums are added
      expect(getQueueFromState(previousState))
        .toHaveLength(getQueueFromState(currentState).length);
    });
  });

  describe("remove", () => {
    test("can remove an album from queue", () => {
      const [ first, second, third ] = albums;
      const previousState = createQueueState([ first, second, third ]);
      const currentState =  reducer(previousState, queueRemove(second.id));

      expect(getAlbumPosition(currentState, first.id)).toBe(0);
      expect(getAlbumPosition(currentState, second.id)).toBe(-1);
      expect(getAlbumPosition(currentState, third.id)).toBe(1);

      // one is removed
      expect(getQueueFromState(previousState))
        .toHaveLength(getQueueFromState(currentState).length + 1);
    });
  });

  describe("prepend", () => {
    test("album is added to the first place in the queue", () => {
      const [ first, second, third ] = albums;
      const previousState = createQueueState([ first, second ]);
      const currentState =  reducer(previousState, queuePrepend(third));

      expect(getAlbumPosition(currentState, first.id)).toBe(1);
      expect(getAlbumPosition(currentState, second.id)).toBe(2);
      expect(getAlbumPosition(currentState, third.id)).toBe(0);

      // one is added
      expect(getQueueFromState(previousState))
        .toHaveLength(getQueueFromState(currentState).length - 1);
    });

    test("album that is already in the queue is moved to the first place in the queue", () => {
      const [ first, second, third ] = albums;
      const previousState = createQueueState([ first, second, third ]);
      const currentState =  reducer(previousState, queuePrepend(second));

      expect(getAlbumPosition(currentState, first.id)).toBe(1);
      expect(getAlbumPosition(currentState, second.id)).toBe(0);
      expect(getAlbumPosition(currentState, third.id)).toBe(2);

      // no extra albums are added
      expect(getQueueFromState(previousState))
        .toHaveLength(getQueueFromState(currentState).length);
    });
  });

  describe("pop", () => {
    test("the first album is removed from the queue", () => {
      const [ first, second, third ] = albums;
      const previousState = createQueueState([ first, second, third ]);
      const currentState =  reducer(previousState, queuePop());
      
      expect(getAlbumPosition(currentState, first.id)).toBe(-1);
      expect(getAlbumPosition(currentState, second.id)).toBe(0);
      expect(getAlbumPosition(currentState, third.id)).toBe(1);

      // one is removed
      expect(getQueueFromState(previousState))
        .toHaveLength(getQueueFromState(currentState).length + 1);
    });

    test("can pop from queue with a single album", () => {
      const [album] = albums;
      const previousState = createQueueState([album]);
      const currentState =  reducer(previousState, queuePop());

      expect(getQueueFromState(currentState)).toHaveLength(0);
    });

    test("can pop from an empty queue", () => {
      const previousState = createQueueState([]);
      const currentState =  reducer(previousState, queuePop());

      expect(getQueueFromState(currentState)).toHaveLength(0);
    });
  });

  describe("update", () => {
    test("can update album in the queue", () => {
      const [ first, second, third ] = albums;
      const previousState = createQueueState([ first, second, third ]);

      const { id } = second;
      const newAlbum: Album = {
        id,
        ...newAlbumValues,
      };

      const currentState =  reducer(previousState, queueUpdate(newAlbum));

      // updated album values are changed
      expect(getQueueFromState(currentState)[1]).toStrictEqual(newAlbum);
      expect(getQueueFromState(currentState)[1]).not.toStrictEqual(second);

      // other albums remain unchanged
      expect(getQueueFromState(currentState)[0]).toStrictEqual(first);
      expect(getQueueFromState(currentState)[2]).toStrictEqual(third);

      // queue length remains unchanged
      expect(getQueueFromState(previousState))
        .toHaveLength(getQueueFromState(currentState).length);
    });
  });
});

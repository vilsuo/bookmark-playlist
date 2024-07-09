import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { createAlbum, createFromBookmarks, deleteAlbum, fetchAlbums, selectAlbumCategories, selectAlbums, selectIsAloneInCategory, updateAlbum } from "./albumsSlice";
import { Album, AlbumUpdate, NotificationType } from "../../../types";
import { RootState, setupStore } from "../../store";
import { albums, categories, newAlbum, newAlbumValues, updatedAlbumValues } from "../../../../test/constants";
import { createAlbumCategoryFilterRootState, createAlbumWithCategory, createAlbumsState, createQueueState } from "../../../../test/creators";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { BASE_URL as ALBUMS_BASE_URL } from "../../../util/albumService";
import { Notification, selectNotifications } from "../notificationSlice";
import { selectQueue } from "../queueSlice";
import { selectFilterCategories } from "../filters/filterSlice";
import { BASE_URL as CONVERTER_BASE_URL } from "../../../util/converterService";

const createAlbumsRootState = (albums: Album[] = []): RootState => (
  { albums: createAlbumsState({ albums }) } as RootState
);

const createAlbumsQueueRootState = ({ albums = [], queue = [] }: {
  albums: Album[], queue: Album[],
}): RootState => (
  {
    albums: createAlbumsState({ albums }),
    queue: createQueueState(queue),
  } as RootState
);

const createServerMockErrorResponse = (message: string, status = 400) => {
  return HttpResponse.json({ message } , { status });
};

const expectToHaveNotification = (
  notifications: Notification[],
  { type, title, message }: Omit<Notification, "id">
) => {
  if (message !== undefined) {
    expect(notifications).toContainEqual(
      expect.objectContaining({
        type,
        title,
        message,
      }),
    );
  } else {
    expect(notifications).toContainEqual(
      expect.objectContaining({
        type,
        title,
      }),
    );
  }
};

describe("Albums slice", () => {
  describe("selectors", () => {
    const [ targetCategory, otherCategory ] = categories;

    const sameFirst = createAlbumWithCategory(albums[0], targetCategory);
    const sameSecond = createAlbumWithCategory(albums[1], targetCategory);
    const other = createAlbumWithCategory(albums[2], otherCategory);

    describe("selectAlbumCategories", () => {
      test("should contain exactly one of each category", () => {
        const previousState = createAlbumsRootState([sameFirst, sameSecond, other]);
        const result = selectAlbumCategories(previousState);

        expect(result).toHaveLength(2);
        expect(result).toContain(sameFirst.category);
        expect(result).toContain(other.category);
      });
    });

    describe("selectIsAloneInCategory", () => {
      test("should be false without any albums", () => {
        const previousState = createAlbumsRootState();
        const result = selectIsAloneInCategory(previousState, targetCategory);

        expect(result).toBeFalsy();
      });

      describe("single category", () => {
        describe("single album exists", () => {
          test("should be true with the album category", () => {
            const previousState = createAlbumsRootState([sameFirst]);
            const result = selectIsAloneInCategory(previousState, sameFirst.category);

            expect(result).toBeTruthy();
          });

          test("should be false with other category", () => {
            const previousState = createAlbumsRootState([sameFirst]);
            const result = selectIsAloneInCategory(previousState, other.category);

            expect(result).toBeFalsy();
          });
        });

        test("should be false when there are multiple albums with the category", () => {
          const previousState = createAlbumsRootState([sameFirst, sameSecond]);
          const result = selectIsAloneInCategory(previousState, sameFirst.category);

          expect(result).toBeFalsy();
        });
      });

      describe("multiple categories", () => {
        test("should be true when each category has a single album", () => {
          const previousState = createAlbumsRootState([sameFirst, other]);

          const firstResult = selectIsAloneInCategory(previousState, sameFirst.category);
          expect(firstResult).toBeTruthy();

          const secondResult = selectIsAloneInCategory(previousState, other.category);
          expect(secondResult).toBeTruthy();
        });

        test("should be false when category has multiple albums", () => {
          const previousState = createAlbumsRootState([sameFirst, sameSecond, other]);

          const firstResult = selectIsAloneInCategory(previousState, sameFirst.category);
          expect(firstResult).toBeFalsy();

          const secondResult = selectIsAloneInCategory(previousState, other.category);
          expect(secondResult).toBeTruthy();
        });
      });
    });
  });

  describe("async thunks", () => {
    const server = setupServer();
  
    // Enable API mocking before tests.
    beforeAll(() => server.listen());
  
    // Reset any runtime request handlers we may add during the tests.
    afterEach(() => server.resetHandlers());
  
    // Disable API mocking after the tests are done.
    afterAll(() => server.close());

    const [ newCategory, ...initialCategories] = categories;

    const initialAlbums = [
      createAlbumWithCategory(albums[0], initialCategories[0]), // same category
      createAlbumWithCategory(albums[1], initialCategories[0]), // same category
      createAlbumWithCategory(albums[2], initialCategories[1]),
      createAlbumWithCategory(albums[3], initialCategories[2]),
    ];

    describe("fetchAlbums", () => {
      describe("on successful request", () => {
        beforeEach(() => {
          server.use(http.get(ALBUMS_BASE_URL, async () => {
            return HttpResponse.json(initialAlbums);
          }));
        });

        test("should load the albums", async () => {
          const store = setupStore();

          await store.dispatch(fetchAlbums());
          const result = selectAlbums(store.getState());
          expect(result).toStrictEqual(initialAlbums);
        });
      });

      describe("on failed request", () => {
        // simulate network error
        beforeEach(() => {
          server.use(http.get(ALBUMS_BASE_URL, async () => {
            return HttpResponse.error();
          }));
        });

        test("should not load albums", async () => {
          const store = setupStore();
          await store.dispatch(fetchAlbums());

          const result = selectAlbums(store.getState());
          expect(result).toHaveLength(0);
        });

        test("should create an error notification", async () => {
          const store = setupStore();
          await store.dispatch(fetchAlbums());

          const result = selectNotifications(store.getState());
          expectToHaveNotification(result, {
            type: NotificationType.ERROR,
            title: 'Loading albums failed',
            message: "Unknown axios error",
          });
        });
      });
    });

    describe("createFromBookmarks", () => {
      const createdAlbums = [newAlbum];
      const formData = new FormData();

      describe("on successful request", () => {
        beforeEach(() => {
          server.use(http.post(CONVERTER_BASE_URL, () => {
            return HttpResponse.json(createdAlbums, { status: 201 });
          }));
        });

        test("should load the albums", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(createFromBookmarks(formData));

          const result = selectAlbums(store.getState());
          expect(result).toContainEqual(createdAlbums[0]);
          expect(result).toHaveLength(initialAlbums.length + createdAlbums.length);
        });

        test("should create a success notification", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(createFromBookmarks(formData));

          const result = selectNotifications(store.getState());
          expectToHaveNotification(result, {
            type: NotificationType.SUCCESS,
            title: "Bookmarks imported",
          })
        });
      });

      describe("on failed request", () => {
        const message = "Folder not found";

        // simulate a server error
        beforeEach(() => {
          server.use(http.post(CONVERTER_BASE_URL, async () => {
            return createServerMockErrorResponse(message);
          }));
        });

        test("should not load albums", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(createFromBookmarks(formData));

          const result = selectAlbums(store.getState());
          expect(result).not.toContainEqual(createdAlbums[0]);
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create an error notification", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(createFromBookmarks(formData));

          const result = selectNotifications(store.getState());
          expectToHaveNotification(result, {
            type: NotificationType.ERROR,
            title: "Bookmark import failed",
            message,
          })
        });
      });
    });

    describe("createAlbum", () => {
      describe("on successful request", () => {
        beforeEach(() => {
          server.use(http.post(ALBUMS_BASE_URL, async () => {
            return HttpResponse.json(newAlbum, { status: 201 })
          }));
        });

        test("should add the album", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(createAlbum(newAlbumValues));

          const result = selectAlbums(store.getState());
          expect(result).toContainEqual(newAlbum);
          expect(result).toHaveLength(initialAlbums.length + 1);
        });

        test("should create a success notification", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(createAlbum(newAlbumValues));
          const result = selectNotifications(store.getState());

          expectToHaveNotification(result, {
            type: NotificationType.SUCCESS,
            title: 'Album added successfully',
          });
        });
      });

      describe("on failed request", () => {
        const message = "Validation failed on album";

        // simulate a "validation" error
        beforeEach(() => {
          server.use(http.post(ALBUMS_BASE_URL, async () => {
            return createServerMockErrorResponse(message);
          }));
        });

        test("should not add the album", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(createAlbum(newAlbumValues));

          const result = selectAlbums(store.getState());
          expect(result).not.toContainEqual(newAlbum);
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create an error notification", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(createAlbum(newAlbumValues));

          const result = selectNotifications(store.getState());
          expectToHaveNotification(result, {
            type: NotificationType.ERROR,
            title: 'Album adding failed',
            message,
          });
        });
      });
    });

    describe("updateAlbum", () => {
      const albumToUpdate = initialAlbums[1];
      const otherAlbum = initialAlbums[2];
      const updatedAlbum = { ...albumToUpdate, ...updatedAlbumValues };

      describe("successful request", () => {
        beforeEach(() => {
          server.use(
            http.put<{ id: string }, AlbumUpdate, Album>(
              `${ALBUMS_BASE_URL}/:id`,
              async ({ request, params }) => {
                const id = Number(params.id);
        
                // Read the intercepted request body as JSON.
                const body = await request.json();

                const addDate = initialAlbums.find(a => a.id === id)!.addDate;
        
                return HttpResponse.json({
                  id,
                  ...body,
                  addDate,
                });
              },
            ),
          );
        });

        test("should update the album", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));

          await store.dispatch(updateAlbum({
            oldAlbum: albumToUpdate,
            newValues: updatedAlbumValues,
          }));

          const result = selectAlbums(store.getState());
          expect(result).toContainEqual(updatedAlbum);
          expect(result).not.toContainEqual(albumToUpdate);
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create a success notification", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));

          await store.dispatch(updateAlbum({
            oldAlbum: albumToUpdate,
            newValues: updatedAlbumValues,
          }));

          const result = selectNotifications(store.getState());
          expectToHaveNotification(result, {
            type: NotificationType.SUCCESS,
            title: "Album edited successfully",
          });
        });

        test("should update the album in the queue", async () => {
          const queue = [albumToUpdate, otherAlbum];
          const state = createAlbumsQueueRootState({ albums: initialAlbums, queue });
          const store = setupStore(state);

          await store.dispatch(updateAlbum({
            oldAlbum: albumToUpdate,
            newValues: updatedAlbumValues,
          }));

          const result = selectQueue(store.getState());
          // album is updated in queue
          expect(result).toContainEqual(updatedAlbum);
          expect(result).not.toContainEqual(albumToUpdate);

          // other albums in queue are not changed
          expect(result).toContainEqual(otherAlbum);
          expect(result).toHaveLength(queue.length);
        });

        test("should remove the category from filter if the category changed and no longer exists", async () => {
          const albumToUpdate = initialAlbums[2];
          const newValues = { ...updatedAlbumValues, category: newCategory };

          const state = createAlbumCategoryFilterRootState(
            initialCategories,
            initialAlbums,
          );

          const store = setupStore(state);

          // check that there are no other albums with the same category
          expect(selectIsAloneInCategory(store.getState(), albumToUpdate.category)).toBe(true);

          await store.dispatch(updateAlbum({ oldAlbum: albumToUpdate, newValues }));

          const result = selectFilterCategories(store.getState());
          expect(result).not.toContainEqual(albumToUpdate.category);
        });

        test("should not remove the category from filter if the category changed, but still exists", async () => {
          const albumToUpdate = initialAlbums[1];
          const newValues = { ...updatedAlbumValues, category: newCategory };

          const state = createAlbumCategoryFilterRootState(
            initialCategories,
            initialAlbums,
          );

          const store = setupStore(state);

          // check that there are other albums with the same category
          expect(selectIsAloneInCategory(store.getState(), albumToUpdate.category)).toBe(false);

          await store.dispatch(updateAlbum({ oldAlbum: albumToUpdate, newValues }));

          const result = selectFilterCategories(store.getState());
          expect(result).toContainEqual(albumToUpdate.category);
        });
      });

      describe("unsuccessful request", () => {
        const message = "Validation failed on album";

        // simulate a "validation" error
        beforeEach(() => {
          server.use(http.put(`${ALBUMS_BASE_URL}/:id`, async () => {
            return createServerMockErrorResponse(message);
          }));
        });

        test("should not update the album", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(updateAlbum({
            oldAlbum: albumToUpdate,
            newValues: updatedAlbumValues,
          }));

          const result = selectAlbums(store.getState());
          expect(result).not.toContainEqual(updatedAlbum);
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create an error notification", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(updateAlbum({
            oldAlbum: albumToUpdate,
            newValues: updatedAlbumValues,
          }));

          const result = selectNotifications(store.getState());
          expectToHaveNotification(result, {
            type: NotificationType.ERROR,
            title: "Album edit failed",
            message,
          });
        });
      });
    });

    describe("removeAlbum", () => {
      const albumToRemove = initialAlbums[1];
      const otherAlbum = initialAlbums[2];

      describe("successful request", () => {
        beforeEach(() => {
          server.use(http.delete(`${ALBUMS_BASE_URL}/:id`, () => {
            return new Response(null, { status: 204 });
          }));
        });

        test("should remove the album", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectAlbums(store.getState());
          expect(result).not.toContainEqual(albumToRemove);
          expect(result).toHaveLength(initialAlbums.length - 1);
        });

        test("should create a success notification", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectNotifications(store.getState());
          expectToHaveNotification(result, {
            type: NotificationType.SUCCESS,
            title: "Album removed successfully",
          });
        });

        test("should remove the album from the queue", async () => {
          const queue = [albumToRemove, otherAlbum];
          const state = createAlbumsQueueRootState({ albums: initialAlbums, queue });
          const store = setupStore(state);

          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectQueue(store.getState());
          // album is updated in queue
          expect(result).not.toContainEqual(albumToRemove);

          // other albums in queue are not changed
          expect(result).toContainEqual(otherAlbum);
          expect(result).toHaveLength(queue.length - 1);
        });

        test("should remove the category from filter if the category no longer exists", async () => {
          const albumToRemove = initialAlbums[2];

          const state = createAlbumCategoryFilterRootState(
            initialCategories,
            initialAlbums,
          );

          const store = setupStore(state);

          // check that there are no other albums with the same category
          expect(selectIsAloneInCategory(store.getState(), albumToRemove.category)).toBe(true);

          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectFilterCategories(store.getState());
          expect(result).not.toContainEqual(albumToRemove.category);
        });

        test("should not remove the category from filter if the category still exists", async () => {
          const albumToRemove = initialAlbums[1];

          const state = createAlbumCategoryFilterRootState(
            initialCategories,
            initialAlbums,
          );

          const store = setupStore(state);

          // check that there are other albums with the same category
          expect(selectIsAloneInCategory(store.getState(), albumToRemove.category)).toBe(false);

          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectFilterCategories(store.getState());
          expect(result).toContainEqual(albumToRemove.category);
        });
      });

      describe("unsuccessful request", () => {
        // simulate a network error
        beforeEach(() => {
          server.use(http.delete(`${ALBUMS_BASE_URL}/:id`, async () => {
            return HttpResponse.error();
          }));
        });

        test("should not delete the album", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectAlbums(store.getState());
          expect(result).toContainEqual(albumToRemove);
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create an error notification", async () => {
          const store = setupStore(createAlbumsRootState(initialAlbums));
          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectNotifications(store.getState());
          expectToHaveNotification(result, {
            type: NotificationType.ERROR,
            title: "Album deletion failed",
            message: "Unknown axios error",
          });
        });
      });
    });
  });
});

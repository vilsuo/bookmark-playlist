import { beforeEach, describe, expect, test } from "@jest/globals";
import { createAlbum, createFromBookmarks, deleteAlbum, fetchAlbums, selectAlbumCategories, selectAlbums, selectIsAloneInCategory, updateAlbum } from "./albumsSlice";
import { Album, NotificationType } from "../../../types";
import { RootState, setupStore } from "../../store";
import { albums, categories, createAlbumWithCategory, newAlbum, newAlbumValues, updatedAlbumValues } from "../../../../test/constants";
import { createDefaultAlbumsRootState, createDefaultAlbumsState, createDefaultFiltersState, createDefaultQueueState } from "../../../../test/state";
import { http, HttpResponse } from "msw";
import { BASE_URL as ALBUMS_BASE_URL } from "../../../util/albumService";
import { Notification, selectNotifications } from "../notificationSlice";
import { selectQueue } from "../queueSlice";
import { FilterCategories, selectFilterCategories } from "../filters/filterSlice";
import { BASE_URL as CONVERTER_BASE_URL } from "../../../util/converterService";
import server, { createServerMockErrorResponse } from "../../../../test/server";

const createAlbumsRootTestState = (albums: Album[] = []) =>
  createDefaultAlbumsRootState({ albums });

export const createAlbumFilterCategoryRootTestState = (
  albums: Album[],
  categories: FilterCategories,
): RootState => (
  {
    albums: createDefaultAlbumsState({ albums }),
    filters: createDefaultFiltersState({ filters: { categories } }),
  } as RootState
);

const createAlbumsQueueRootTestState = (
  albums: Album[] = [],
  queue: Album[] = [],
): RootState => (
  {
    albums: createDefaultAlbumsState({ albums }),
    queue: createDefaultQueueState({ queue }),
  } as RootState
);

const expectToHaveANotification = (
  notifications: Notification[],
  { type, title, message }: Omit<Notification, "id">
) => {
  if (message !== undefined) {
    expect(notifications).toContainEqual(
      expect.objectContaining({
        type, title, message,
      }),
    );
  } else {
    expect(notifications).toContainEqual(
      expect.objectContaining({ type, title }),
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
        const previousState = createAlbumsRootTestState([sameFirst, sameSecond, other]);
        const result = selectAlbumCategories(previousState);

        expect(result).toHaveLength(2);
        expect(result).toContain(sameFirst.category);
        expect(result).toContain(other.category);
      });
    });

    describe("selectIsAloneInCategory", () => {
      test("should be false without any albums", () => {
        const previousState = createAlbumsRootTestState();
        const result = selectIsAloneInCategory(previousState, targetCategory);

        expect(result).toBe(false);
      });

      describe("single category", () => {
        describe("single album exists", () => {
          test("should be true with the album category", () => {
            const previousState = createAlbumsRootTestState([sameFirst]);
            const result = selectIsAloneInCategory(previousState, sameFirst.category);

            expect(result).toBe(true);
          });

          test("should be false with other category", () => {
            const previousState = createAlbumsRootTestState([sameFirst]);
            const result = selectIsAloneInCategory(previousState, other.category);

            expect(result).toBe(false);
          });
        });

        test("should be false when there are multiple albums with the category", () => {
          const previousState = createAlbumsRootTestState([sameFirst, sameSecond]);
          const result = selectIsAloneInCategory(previousState, sameFirst.category);

          expect(result).toBe(false);
        });
      });

      describe("multiple categories", () => {
        test("should be true when each category has a single album", () => {
          const previousState = createAlbumsRootTestState([sameFirst, other]);

          const firstResult = selectIsAloneInCategory(previousState, sameFirst.category);
          expect(firstResult).toBe(true);

          const secondResult = selectIsAloneInCategory(previousState, other.category);
          expect(secondResult).toBe(true);
        });

        test("should be false when category has multiple albums", () => {
          const previousState = createAlbumsRootTestState([sameFirst, sameSecond, other]);

          const firstResult = selectIsAloneInCategory(previousState, sameFirst.category);
          expect(firstResult).toBe(false);

          const secondResult = selectIsAloneInCategory(previousState, other.category);
          expect(secondResult).toBe(true);
        });
      });
    });
  });

  describe("async thunks", () => {
    const [ newCategory, ...initialCategories] = categories;

    const initialAlbums = [
      createAlbumWithCategory(albums[0], initialCategories[0]), // same category
      createAlbumWithCategory(albums[1], initialCategories[0]), // same category
      createAlbumWithCategory(albums[2], initialCategories[1]),
      createAlbumWithCategory(albums[3], initialCategories[2]),
    ];

    describe("fetchAlbums", () => {
      describe("on successful request", () => {
        test("should load the albums", async () => {
          const store = setupStore();

          const before = selectAlbums(store.getState());
          expect(before).toHaveLength(0);

          await store.dispatch(fetchAlbums());
          const result = selectAlbums(store.getState());
          expect(result).toStrictEqual(albums);
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
          expectToHaveANotification(result, {
            type: NotificationType.ERROR,
            title: 'Loading albums failed',
            message: "Unknown axios error",
          });
        });
      });
    });

    describe("createFromBookmarks", () => {
      const initialAlbums = [newAlbum];
      const formData = new FormData();

      describe("on successful request", () => {
        test("should load the albums", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(createFromBookmarks(formData));

          const result = selectAlbums(store.getState());
          expect(result).toStrictEqual([ ...initialAlbums, ...albums ]);
        });

        test("should create a success notification", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(createFromBookmarks(formData));

          const result = selectNotifications(store.getState());
          expectToHaveANotification(result, {
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
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(createFromBookmarks(formData));

          const result = selectAlbums(store.getState());
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create an error notification", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(createFromBookmarks(formData));

          const result = selectNotifications(store.getState());
          expectToHaveANotification(result, {
            type: NotificationType.ERROR,
            title: "Bookmark import failed",
            message,
          })
        });
      });
    });

    describe("createAlbum", () => {
      const initialAlbums = albums;

      describe("on successful request", () => {
        test("should add the album", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(createAlbum(newAlbumValues));

          const result = selectAlbums(store.getState());
          expect(result).toStrictEqual([ ...initialAlbums, newAlbum ]);
        });

        test("should create a success notification", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(createAlbum(newAlbumValues));

          const result = selectNotifications(store.getState());
          expectToHaveANotification(result, {
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
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(createAlbum(newAlbumValues));

          const result = selectAlbums(store.getState());
          expect(result).not.toContainEqual(newAlbum);
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create an error notification", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(createAlbum(newAlbumValues));

          const result = selectNotifications(store.getState());
          expectToHaveANotification(result, {
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
        test("should update the album", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));

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
          const store = setupStore(createAlbumsRootTestState(initialAlbums));

          await store.dispatch(updateAlbum({
            oldAlbum: albumToUpdate,
            newValues: updatedAlbumValues,
          }));

          const result = selectNotifications(store.getState());
          expectToHaveANotification(result, {
            type: NotificationType.SUCCESS,
            title: "Album edited successfully",
          });
        });

        test("should update the album in the queue", async () => {
          const queue = [albumToUpdate, otherAlbum];
          const state = createAlbumsQueueRootTestState(initialAlbums, queue);
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

          const state = createAlbumFilterCategoryRootTestState(
            initialAlbums,
            initialCategories,
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

          const state = createAlbumFilterCategoryRootTestState(
            initialAlbums,
            initialCategories,
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
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(updateAlbum({
            oldAlbum: albumToUpdate,
            newValues: updatedAlbumValues,
          }));

          const result = selectAlbums(store.getState());
          expect(result).not.toContainEqual(updatedAlbum);
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create an error notification", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(updateAlbum({
            oldAlbum: albumToUpdate,
            newValues: updatedAlbumValues,
          }));

          const result = selectNotifications(store.getState());
          expectToHaveANotification(result, {
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
        test("should remove the album", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectAlbums(store.getState());
          expect(result).not.toContainEqual(albumToRemove);
          expect(result).toHaveLength(initialAlbums.length - 1);
        });

        test("should create a success notification", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectNotifications(store.getState());
          expectToHaveANotification(result, {
            type: NotificationType.SUCCESS,
            title: "Album removed successfully",
          });
        });

        test("should remove the album from the queue", async () => {
          const queue = [albumToRemove, otherAlbum];
          const state = createAlbumsQueueRootTestState(initialAlbums, queue);
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

          const state = createAlbumFilterCategoryRootTestState(
            initialAlbums,
            initialCategories,
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

          const state = createAlbumFilterCategoryRootTestState(
            initialAlbums,
            initialCategories,
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
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectAlbums(store.getState());
          expect(result).toContainEqual(albumToRemove);
          expect(result).toHaveLength(initialAlbums.length);
        });

        test("should create an error notification", async () => {
          const store = setupStore(createAlbumsRootTestState(initialAlbums));
          await store.dispatch(deleteAlbum(albumToRemove));

          const result = selectNotifications(store.getState());
          expectToHaveANotification(result, {
            type: NotificationType.ERROR,
            title: "Album deletion failed",
            message: "Unknown axios error",
          });
        });
      });
    });
  });
});

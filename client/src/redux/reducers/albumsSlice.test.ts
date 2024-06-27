import { describe, expect, test } from "@jest/globals";
import { AlbumsState, selectCategories, selectIsAloneInCategory, selectSortedAndFilteredAlbums } from "./albumsSlice";
import { Album } from "../../types";
import { RootState } from "../store";
import { albums, categories } from "../../../test/constants";
import { createAlbumsState, createFilterState } from "../../../test/creators";
import { FilterState } from "./filterSlice";

const createAlbumWithCategory = (album: Album, category: string): Album => ({
  ...album, category,
});

const createAlbumsRootState = (albums: AlbumsState["albums"]): RootState => (
  { albums: createAlbumsState({ albums }) } as RootState
);

const createFilteringAndSortingRootState = (
  { albumsState, filterState }: {
    albumsState?: Partial<AlbumsState>,
    filterState?: Partial<FilterState>,
  } = {}
): RootState => (
  {
    albums: createAlbumsState(albumsState),
    filters: createFilterState(filterState),
  } as RootState
);


describe("Albums slice", () => {
  describe("selectors", () => {
    const [ targetCategory, otherCategory ] = categories;

    const sameFirst = createAlbumWithCategory(albums[0], targetCategory);
    const sameSecond = createAlbumWithCategory(albums[1], targetCategory);
    const other = createAlbumWithCategory(albums[2], otherCategory);

    describe("selectCategories", () => {
      test("should contain exactly one of each category", () => {
        const previousState = createAlbumsRootState([sameFirst, sameSecond, other]);
        const result = selectCategories(previousState);

        expect(result).toHaveLength(2);
        expect(result).toContain(sameFirst.category);
        expect(result).toContain(other.category);
      });
    });

    describe("selectIsAloneInCategory", () => {
      test("should be false without any albums", () => {
        const previousState = createAlbumsRootState([]);
        const selector = selectIsAloneInCategory(targetCategory);
        const result = selector(previousState);

        expect(result).toBeFalsy();
      });

      describe("single category", () => {
        describe("single album exists", () => {
          test("should be true with the album category", () => {
            const previousState = createAlbumsRootState([sameFirst]);
            const selector = selectIsAloneInCategory(sameFirst.category)
            const result = selector(previousState);

            expect(result).toBeTruthy();
          });

          test("should be false with other category", () => {
            const previousState = createAlbumsRootState([sameFirst]);
            const selector = selectIsAloneInCategory(other.category)
            const result = selector(previousState);

            expect(result).toBeFalsy();
          });
        });

        test("should be false when there are multiple albums with the category", () => {
          const previousState = createAlbumsRootState([sameFirst, sameSecond]);
          const selector = selectIsAloneInCategory(sameFirst.category)
          const result = selector(previousState);

          expect(result).toBeFalsy();
        });
      });

      describe("multiple categories", () => {
        test("should be true when each category has a single album", () => {
          const previousState = createAlbumsRootState([sameFirst, other]);

          const firstSelector = selectIsAloneInCategory(sameFirst.category);
          const firstResult = firstSelector(previousState);
          expect(firstResult).toBeTruthy();

          const secondSelector = selectIsAloneInCategory(other.category);
          const secondResult = secondSelector(previousState);
          expect(secondResult).toBeTruthy();
        });

        test("should be false when category has multiple albums", () => {
          const previousState = createAlbumsRootState([sameFirst, sameSecond, other]);

          const firstSelector = selectIsAloneInCategory(sameFirst.category);
          const firstResult = firstSelector(previousState);
          expect(firstResult).toBeFalsy();

          const secondSelector = selectIsAloneInCategory(other.category);
          const secondResult = secondSelector(previousState);
          expect(secondResult).toBeTruthy();
        });
      });
    });

    describe("selectSortedAndFilteredAlbums", () => {
      test("should return empty array when there are no albums", () => {
        const state = createFilteringAndSortingRootState();

        const result = selectSortedAndFilteredAlbums(state);
        expect(result).toHaveLength(0);
      });  
    });

    /*
    describe("selectCanPlayNextAlbum", () => {
      describe(PlayMode.MANUAL, () => {
        test("should return true if queue is not empty", () => {

        });

        test("should return false is queue is empty", () => {

        });
      });

      describe(PlayMode.SEQUENCE, () => {

      });

      describe(PlayMode.SHUFFLE, () => {

      });
    });
    */
  });

  /*
  describe("thunks", () => {
    describe("playNext", () => {
      test.todo("");
    });
  });
  */
});

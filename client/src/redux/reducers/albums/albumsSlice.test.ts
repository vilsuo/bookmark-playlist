import { describe, expect, test } from "@jest/globals";
import { selectAlbumCategories, selectIsAloneInCategory } from "./albumsSlice";
import { Album } from "../../../types";
import { RootState } from "../../store";
import { albums, categories } from "../../../../test/constants";
import { createAlbumWithCategory, createAlbumsState } from "../../../../test/creators";

const createAlbumsRootState = (albums: Album[] = []): RootState => (
  { albums: createAlbumsState({ albums }) } as RootState
);

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
  describe("async thunks", () => {
  });
  */
});

import { describe, expect, test } from "@jest/globals";
import { AlbumsState, selectCategories, selectIsAloneInCategory } from "./albumsSlice";
import { Album } from "../../types";
import { RootState } from "../store";
import { albums, categories } from "../../../test/constants";

const createRootState = (albums: Album[]): RootState =>
  ({ albums: createAlbumsState({ albums }) }) as RootState;

const createAlbumsState = ({ albums = [], viewing = null, playing = null }
  : Partial<AlbumsState>): AlbumsState => ({ viewing, playing, albums });

const createWithCategory = (album: Album, category: string): Album => ({
  ...album, category,
});

describe("Albums slice", () => {
  describe("selectors", () => {
    const [ targetCategory, otherCategory ] = categories;

    const sameFirst = createWithCategory(albums[0], targetCategory);
    const sameSecond = createWithCategory(albums[1], targetCategory);
    const other = createWithCategory(albums[2], otherCategory);

    describe("select categories", () => {
      test("select categories does not return duplicate categories", () => {
        const previousState = createRootState([sameFirst, sameSecond, other]);
        const result = selectCategories(previousState);

        expect(result).toHaveLength(2);
        expect(result).toContain(sameFirst.category);
        expect(result).toContain(other.category);
      });
    });

    describe("select is alone in category", () => {
      test("without albums, category is not alone", () => {
        const previousState = createRootState([]);
        const selector = selectIsAloneInCategory(targetCategory);
        const result = selector(previousState);

        expect(result).toBeFalsy();
      });

      describe("with a single category", () => {
        describe("with a single album", () => {
          test("the album category is alone", () => {
            const previousState = createRootState([sameFirst]);
            const selector = selectIsAloneInCategory(sameFirst.category)
            const result = selector(previousState);

            expect(result).toBeTruthy();
          });

          test("other category is not alone", () => {
            const previousState = createRootState([sameFirst]);
            const selector = selectIsAloneInCategory(other.category)
            const result = selector(previousState);

            expect(result).toBeFalsy();
          });
        });

        test("with multiple albums with the given category, the category is not alone", () => {
          const previousState = createRootState([sameFirst, sameSecond]);
          const selector = selectIsAloneInCategory(sameFirst.category)
          const result = selector(previousState);

          expect(result).toBeFalsy();
        });
      });

      describe("with multiple categories", () => {
        test("all categories that have a single album are alone", () => {
          const previousState = createRootState([sameFirst, other]);

          const firstSelector = selectIsAloneInCategory(sameFirst.category)
          const firstResult = firstSelector(previousState);
          expect(firstResult).toBeTruthy();

          const secondSelector = selectIsAloneInCategory(other.category)
          const secondResult = secondSelector(previousState);
          expect(secondResult).toBeTruthy();
        });

        test("just the categories that have a single album are alone", () => {
          const previousState = createRootState([sameFirst, sameSecond, other]);

          const firstSelector = selectIsAloneInCategory(sameFirst.category)
          const firstResult = firstSelector(previousState);
          expect(firstResult).toBeFalsy();

          const secondSelector = selectIsAloneInCategory(other.category)
          const secondResult = secondSelector(previousState);
          expect(secondResult).toBeTruthy();
        });
      });
    });
  });
});

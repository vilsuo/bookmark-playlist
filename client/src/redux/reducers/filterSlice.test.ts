import { describe, expect, test } from "@jest/globals";
import reducer, { FilterState, selectIsAllCategoriesFiltered, selectIsCategoryFiltered, setSort, toggleFilterCategoryAll } from "./filterSlice";
import { AlbumColumn, Order } from "../../types";
import { CATEGORY_ALL } from "../../constants";
import { categories } from "../../../test/constants";
import { RootState } from "../store";
import { createFilterState } from "../../../test/creators";

const createSortingFilterState = (sortColumn: AlbumColumn, sortOrder: Order) =>
  createFilterState({ sortColumn, sortOrder });

const createCategoryFilterState = (categories: FilterState["categories"]) =>
  createFilterState({ categories });

const createCategoryFilterRootState = (
  filterCategories: FilterState["categories"],
): RootState => (
  { filters: createCategoryFilterState(filterCategories) } as RootState
);

describe("Filter slice", () => {
  describe("reducers", () => {
    describe("setSort", () => {
      test("should toggle order when calling with current column", () => {
        const sortColumn = AlbumColumn.ARTIST;
        const sortOrder = Order.ASC;
        const previousState = createSortingFilterState(sortColumn, sortOrder);
        
        const currentState = reducer(previousState, setSort(sortColumn));
        expect(currentState.sortColumn).toBe(sortColumn);
        expect(currentState.sortOrder).not.toBe(sortOrder);

        const nextState = reducer(currentState, setSort(sortColumn));
        expect(nextState.sortColumn).toBe(sortColumn);
        expect(nextState.sortOrder).toBe(sortOrder);
      });

      test("should keep the current order when changing column", () => {
        const sortColumn = AlbumColumn.ARTIST;
        const sortOrder = Order.ASC;
        const previousState = createSortingFilterState(sortColumn, sortOrder);
        
        const currentState = reducer(previousState, setSort(AlbumColumn.ALBUM));
        expect(currentState.sortColumn).toBe(AlbumColumn.ALBUM);
        expect(currentState.sortOrder).toBe(sortOrder);
      });
    });

    describe("toggleFilterCategoryAll", () => {
      test("should select none when all are selected", () => {
        const previousState = createCategoryFilterState(CATEGORY_ALL);
        const currentState = reducer(previousState, toggleFilterCategoryAll());
        
        expect(currentState.categories).toBeInstanceOf(Array);
        expect(currentState.categories).toHaveLength(0);
      });

      test("should select all when none are selected", () => {
        const previousState = createCategoryFilterState([]);
        const currentState = reducer(previousState, toggleFilterCategoryAll());
        
        expect(currentState.categories).toBe(CATEGORY_ALL);
      });

      test("should select all when some are selected", () => {
        const previousState = createCategoryFilterState([categories[0]]);
        const currentState = reducer(previousState, toggleFilterCategoryAll());
        
        expect(currentState.categories).toBe(CATEGORY_ALL);
      });
    });
  });

  describe("selectors", () => {
    const [ firstCategory, secondCategory ] = categories;

    describe("selectIsCategoryFiltered", () => {
      describe("all category", () => {
        test("should return false when no categories are filtered", () => {
          const state = createCategoryFilterRootState([]);
          const result = selectIsCategoryFiltered(state, CATEGORY_ALL);
          expect(result).toBe(false);
        });
  
        test("should return true when all categories are filtered", () => {
          const state = createCategoryFilterRootState(CATEGORY_ALL);
          const result = selectIsCategoryFiltered(state, CATEGORY_ALL);
          expect(result).toBe(true);
        });

        test("should return false when some categories are filtered", () => {
          const state = createCategoryFilterRootState([firstCategory, secondCategory]);
          const result = selectIsCategoryFiltered(state, CATEGORY_ALL);
          expect(result).toBe(false);
        });
      });

      describe("single category", () => {
        test("should return true when all categories are filtered", () => {
          const state = createCategoryFilterRootState(CATEGORY_ALL);
          const result = selectIsCategoryFiltered(state, firstCategory);
          expect(result).toBe(true);
        });
  
        test("should return true when the category is filtered", () => {
          const state = createCategoryFilterRootState([firstCategory]);
          const result = selectIsCategoryFiltered(state, firstCategory);
          expect(result).toBe(true);
        });

        test("should return false when the category is not filtered", () => {
          const state = createCategoryFilterRootState([firstCategory]);
          const result = selectIsCategoryFiltered(state, secondCategory);
          expect(result).toBe(false);
        });
      });
    });

    describe("selectIsAllCategoriesFiltered", () => {
      test("should return false when no categories are filtered", () => {
        const state = createCategoryFilterRootState([]);
        const result = selectIsAllCategoriesFiltered(state);
        expect(result).toBe(false);
      });

      test("should return true when all categories are filtered", () => {
        const state = createCategoryFilterRootState(CATEGORY_ALL);
        const result = selectIsAllCategoriesFiltered(state);
        expect(result).toBe(true);
      });

      test("should return false when some categories are filtered", () => {
        const state = createCategoryFilterRootState([firstCategory, secondCategory]);
        const result = selectIsAllCategoriesFiltered(state);
        expect(result).toBe(false);
      });
    });
  });

  /*
  describe("thunks", () => {
    describe("toggleFilterCategorySingle", () => {
      describe("when all are selected", () => {
        const initialCategory = CATEGORY_ALL;

        test("all categories are selected except the one toggled", () => {
          const targetCategory = categories[1];

          const previousState = createFilterStateWithFilterCategories(initialCategory);
          const currentState = reducer(previousState, toggleFilterCategorySingle({
            category: targetCategory, categories,
          }));

          // toggled one is missing
          expect(currentState.categories).toHaveLength(categories.length - 1);
          expect(currentState.categories).not.toContain(targetCategory);
        })
      });

      describe("when some are not selected", () => {
        describe("when adding a new category", () => {
          test("if it is the only one missing, then all are added", () => {
            const [targetCategory, ...rest] = categories;
            const previousState = createFilterStateWithFilterCategories(rest);

            const currentState = reducer(previousState, toggleFilterCategorySingle({
              category: targetCategory, categories,
            }));

            expect(currentState.categories).toBe(CATEGORY_ALL);
          });

          test("if it is not the only one missing, then just it is added", () => {
            const [targetCategory, otherCategory, ...rest] = categories;
            const previousState = createFilterStateWithFilterCategories(rest);

            const currentState = reducer(previousState, toggleFilterCategorySingle({
              category: targetCategory, categories,
            }));

            expect(currentState.categories).not.toBe(CATEGORY_ALL);
            expect(currentState.categories).toContain(targetCategory);
            expect(currentState.categories).not.toContain(otherCategory);
          });
        });

        test("when removing a filtered category, only it is removed", () => {
          const [ first, second, third ] = categories;
          const targetCategory = second;
          const previousState = createFilterStateWithFilterCategories([ first, second, third ]);

          const currentState = reducer(previousState, toggleFilterCategorySingle({
            category: targetCategory, categories,
          }));

          expect(currentState.categories).not.toContain(targetCategory);
          expect(currentState.categories).toStrictEqual([first, third]);
        });
      });
    });
  });
  */
});

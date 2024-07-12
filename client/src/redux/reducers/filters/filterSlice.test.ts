import { describe, expect, test } from "@jest/globals";
import reducer, { FilterCategories, selectFilterCategories, selectIsAllCategoriesFiltered, selectIsCategoryFiltered, setSort, toggleFilterCategorySingle, toggleFilteringCategoryAll } from "./filterSlice";
import { Album, AlbumColumn, Order } from "../../../types";
import { CATEGORY_ALL } from "../../../constants";
import { albums, categories, createAlbumWithCategory } from "../../../../test/constants";
import { RootState, setupStore } from "../../store";
import { createDefaultAlbumsState, createDefaultFiltersRootState, createDefaultFiltersState } from "../../../../test/state";

const createFiltersSortingTestState = (column: AlbumColumn, order: Order) =>
  createDefaultFiltersState({ sorting: { column, order } });

const createFiltersCategoriesTestState = (categories: FilterCategories = []) =>
  createDefaultFiltersState({ filters: { categories } });

const createFiltersCategoriesTestRootState = (categories: FilterCategories = []) =>
  createDefaultFiltersRootState({ filters: { categories } });

export const createAlbumCategoryFilterRootState = (
  albums: Album[],
  categories: FilterCategories,
): RootState => (
  {
    albums: createDefaultAlbumsState({ albums }),
    filters: createDefaultFiltersState({ filters: { categories } }),
  } as RootState
);

const expectEqualFilterCategories = (
  cat1: FilterCategories,
  cat2: FilterCategories
) => {
  if (Array.isArray(cat1) && Array.isArray(cat2)) {
    expect(cat1.toSorted()).toEqual(cat2.toSorted());
  } else {
    expect(typeof cat1).toBe(typeof cat2);
    expect(cat1).toBe(cat2);
  }
};


describe("Filter slice", () => {
  describe("reducers", () => {
    describe("setSort", () => {
      const sortColumn = AlbumColumn.ARTIST;
      const sortOrder = Order.ASC;

      test("should toggle order when calling with current column", () => {
        const previousState = createFiltersSortingTestState(sortColumn, sortOrder);
        
        const currentState = reducer(previousState, setSort(sortColumn));
        expect(currentState.sorting.column).toBe(sortColumn);
        expect(currentState.sorting.order).not.toBe(sortOrder);

        const nextState = reducer(currentState, setSort(sortColumn));
        expect(nextState.sorting.column).toBe(sortColumn);
        expect(nextState.sorting.order).toBe(sortOrder);
      });

      test("should keep the current order when changing column", () => {
        const previousState = createFiltersSortingTestState(sortColumn, sortOrder);
        
        const currentState = reducer(previousState, setSort(AlbumColumn.ALBUM));
        expect(currentState.sorting.column).toBe(AlbumColumn.ALBUM);
        expect(currentState.sorting.order).toBe(sortOrder);
      });
    });

    describe("toggleFilteringCategoryAll", () => {
      test("should select none when all are selected", () => {
        const previousState = createFiltersCategoriesTestState(CATEGORY_ALL);
        const currentState = reducer(previousState, toggleFilteringCategoryAll());
        
        expect(currentState.filters.categories).toBeInstanceOf(Array);
        expect(currentState.filters.categories).toHaveLength(0);
      });

      test("should select all when none are selected", () => {
        const previousState = createFiltersCategoriesTestState();
        const currentState = reducer(previousState, toggleFilteringCategoryAll());
        
        expect(currentState.filters.categories).toBe(CATEGORY_ALL);
      });

      test("should select all when some are selected", () => {
        const previousState = createFiltersCategoriesTestState(categories);
        const currentState = reducer(previousState, toggleFilteringCategoryAll());
        
        expect(currentState.filters.categories).toBe(CATEGORY_ALL);
      });
    });
  });

  describe("selectors", () => {
    const [ nonFilteredCategory, ...filterCategories ] = categories;
    const filteredCategory = filterCategories[1];

    describe("selectIsCategoryFiltered", () => {
      describe("all category", () => {
        const category = CATEGORY_ALL;

        test("should return false when no categories are filtered", () => {
          const state = createFiltersCategoriesTestRootState();
          const result = selectIsCategoryFiltered(state, category);
          expect(result).toBe(false);
        });
  
        test("should return true when all categories are filtered", () => {
          const state = createFiltersCategoriesTestRootState(CATEGORY_ALL);
          const result = selectIsCategoryFiltered(state, category);
          expect(result).toBe(true);
        });

        test("should return false when some categories are filtered", () => {
          const state = createFiltersCategoriesTestRootState(filterCategories);
          const result = selectIsCategoryFiltered(state, category);
          expect(result).toBe(false);
        });
      });

      describe("single category", () => {
        test("should return true when all categories are filtered", () => {
          const state = createFiltersCategoriesTestRootState(CATEGORY_ALL);
          const result = selectIsCategoryFiltered(state, filteredCategory);
          expect(result).toBe(true);
        });
  
        test("should return true when the category is filtered", () => {
          const state = createFiltersCategoriesTestRootState(filterCategories);
          const result = selectIsCategoryFiltered(state, filteredCategory);
          expect(result).toBe(true);
        });

        test("should return false when the category is not filtered", () => {
          const state = createFiltersCategoriesTestRootState(filterCategories);
          const result = selectIsCategoryFiltered(state, nonFilteredCategory);
          expect(result).toBe(false);
        });
      });
    });

    describe("selectIsAllCategoriesFiltered", () => {
      test("should return false when no categories are filtered", () => {
        const state = createFiltersCategoriesTestRootState();
        const result = selectIsAllCategoriesFiltered(state);
        expect(result).toBe(false);
      });

      test("should return true when all categories are filtered", () => {
        const state = createFiltersCategoriesTestRootState(CATEGORY_ALL);
        const result = selectIsAllCategoriesFiltered(state);
        expect(result).toBe(true);
      });

      test("should return false when some categories are filtered", () => {
        const state = createFiltersCategoriesTestRootState(filterCategories);
        const result = selectIsAllCategoriesFiltered(state);
        expect(result).toBe(false);
      });
    });
  });

  describe("thunks", () => {
    describe("toggleFilterCategorySingle", () => {
      const initialCategories = [ categories[0], categories[1], categories[2] ];

      const initialAlbums = [
        createAlbumWithCategory(albums[0], initialCategories[0]), // same category
        createAlbumWithCategory(albums[1], initialCategories[0]), // same category
        createAlbumWithCategory(albums[2], initialCategories[1]),
        createAlbumWithCategory(albums[3], initialCategories[2]),
      ];

      describe("when all categories are toggled in the filter", () => {
        const initialFilterCategories = CATEGORY_ALL;

        test("should filter all categories except the toggled", () => {
          const [ targetCategory, ...rest ] = initialCategories;

          const state = createAlbumCategoryFilterRootState(
            initialAlbums,
            initialFilterCategories, 
          );
          
          const store = setupStore(state);

          store.dispatch(toggleFilterCategorySingle(targetCategory));

          const result = selectFilterCategories(store.getState());
          expect(result).not.toContainEqual(targetCategory);
          expectEqualFilterCategories(result, rest);
        });
      });

      describe("when all categories are not toggled in the filter", () => {
        describe("toggling a category that is not filtered", () => {
          test("should toggle on just the category even if it is only one missing", () => {
            const [ targetCategory, ...initialFilterCategories ] = initialCategories;

            const state = createAlbumCategoryFilterRootState(
              initialAlbums,
              initialFilterCategories, 
            );
            
            const store = setupStore(state);

            store.dispatch(toggleFilterCategorySingle(targetCategory));

            const result = selectFilterCategories(store.getState());
            expect(result).not.toBe(CATEGORY_ALL);
            expect(result).toContainEqual(targetCategory);
            expectEqualFilterCategories(result, initialCategories);
          });

          test("should toggle on the category if it is not the only one missing", () => {
            const [ targetCategory, otherCategory, ...initialFilterCategories ] = initialCategories;

            const state = createAlbumCategoryFilterRootState(
              initialAlbums,
              initialFilterCategories, 
            );
            
            const store = setupStore(state);

            store.dispatch(toggleFilterCategorySingle(targetCategory));

            const result = selectFilterCategories(store.getState());
            expect(result).not.toBe(CATEGORY_ALL);
            expect(result).toContainEqual(targetCategory);
            expect(result).not.toContainEqual(otherCategory);
            expectEqualFilterCategories(result, [ targetCategory, ...initialFilterCategories ]);
          });
        });

        describe("toggling a category that is filtered", () => {
          test("should toggle off just the category", () => {
            const [ otherCategory, ...initialFilterCategories ] = initialCategories;
            const [ targetCategory, ...rest ] = initialFilterCategories;

            const state = createAlbumCategoryFilterRootState(
              initialAlbums,
              initialFilterCategories, 
            );
            
            const store = setupStore(state);

            store.dispatch(toggleFilterCategorySingle(targetCategory));

            const result = selectFilterCategories(store.getState());
            expect(result).not.toBe(CATEGORY_ALL);

            expect(result).not.toContainEqual(targetCategory);
            expect(result).not.toContainEqual(otherCategory);
            expectEqualFilterCategories(result, rest);
          });
        });
      });
    });
  });
});

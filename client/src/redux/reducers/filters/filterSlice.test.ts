import { describe, expect, test } from "@jest/globals";
import reducer, { FilterCategories, selectFilterCategories, selectIsAllCategoriesFiltered, selectIsCategoryFiltered, setSort, toggleFilterCategorySingle, toggleFilteringCategoryAll } from "./filterSlice";
import { Album, AlbumColumn, Order } from "../../../types";
import { CATEGORY_ALL } from "../../../constants";
import { albums, categories } from "../../../../test/constants";
import { RootState, setupStore } from "../../store";
import { createAlbumWithCategory, createAlbumsState, createFilterState } from "../../../../test/creators";

const createSortingFilterState = (column: AlbumColumn, order: Order) =>
  createFilterState({ sorting: { column, order } });

const createCategoryFilterState = (categories: FilterCategories) =>
  createFilterState({ filters: { categories } });

const createCategoryFilterRootState = (
  filterCategories: FilterCategories,
): RootState => (
  { filters: createCategoryFilterState(filterCategories) } as RootState
);

const createCategoryFilterTogglingRootState = (
  categories: FilterCategories,
  albums: Album[],
): RootState => (
  {
    filters: createCategoryFilterState(categories),
    albums: createAlbumsState({ albums }),
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
        const previousState = createSortingFilterState(sortColumn, sortOrder);
        
        const currentState = reducer(previousState, setSort(sortColumn));
        expect(currentState.sorting.column).toBe(sortColumn);
        expect(currentState.sorting.order).not.toBe(sortOrder);

        const nextState = reducer(currentState, setSort(sortColumn));
        expect(nextState.sorting.column).toBe(sortColumn);
        expect(nextState.sorting.order).toBe(sortOrder);
      });

      test("should keep the current order when changing column", () => {
        const previousState = createSortingFilterState(sortColumn, sortOrder);
        
        const currentState = reducer(previousState, setSort(AlbumColumn.ALBUM));
        expect(currentState.sorting.column).toBe(AlbumColumn.ALBUM);
        expect(currentState.sorting.order).toBe(sortOrder);
      });
    });

    describe("toggleFilteringCategoryAll", () => {
      test("should select none when all are selected", () => {
        const previousState = createCategoryFilterState(CATEGORY_ALL);
        const currentState = reducer(previousState, toggleFilteringCategoryAll());
        
        expect(currentState.filters.categories).toBeInstanceOf(Array);
        expect(currentState.filters.categories).toHaveLength(0);
      });

      test("should select all when none are selected", () => {
        const previousState = createCategoryFilterState([]);
        const currentState = reducer(previousState, toggleFilteringCategoryAll());
        
        expect(currentState.filters.categories).toBe(CATEGORY_ALL);
      });

      test("should select all when some are selected", () => {
        const previousState = createCategoryFilterState([categories[0]]);
        const currentState = reducer(previousState, toggleFilteringCategoryAll());
        
        expect(currentState.filters.categories).toBe(CATEGORY_ALL);
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

          const state = createCategoryFilterTogglingRootState(
            initialFilterCategories, 
            initialAlbums,
          );
          
          const store = setupStore(state);

          store.dispatch(toggleFilterCategorySingle(targetCategory));
          const result = selectFilterCategories(store.getState());

          expect(result).not.toEqual(initialFilterCategories);
          expect(result).not.toContain(targetCategory);
          expectEqualFilterCategories(result, rest);
        });
      });

      describe("when all categories are not toggled in the filter", () => {
        describe("toggling a category that is not filtered", () => {
          test("should toggle on just the category even if it is only one missing", () => {
            const [ targetCategory, ...initialFilterCategories ] = initialCategories;

            const state = createCategoryFilterTogglingRootState(
              initialFilterCategories, 
              initialAlbums,
            );
            
            const store = setupStore(state);

            store.dispatch(toggleFilterCategorySingle(targetCategory));
            const result = selectFilterCategories(store.getState());

            expect(result).not.toEqual(initialFilterCategories);
            expect(result).not.toEqual(CATEGORY_ALL);

            expect(result).toContain(targetCategory);
            expectEqualFilterCategories(result, initialCategories);
          });

          test("should toggle on the category if it is not the only one missing", () => {
            const [ targetCategory, otherCategory, ...initialFilterCategories ] = initialCategories;

            const state = createCategoryFilterTogglingRootState(
              initialFilterCategories, 
              initialAlbums,
            );
            
            const store = setupStore(state);

            store.dispatch(toggleFilterCategorySingle(targetCategory));
            const result = selectFilterCategories(store.getState());

            expect(result).not.toEqual(initialFilterCategories);
            expect(result).not.toEqual(CATEGORY_ALL);

            expect(result).toContain(targetCategory);
            expect(result).not.toContain(otherCategory);
            expectEqualFilterCategories(result, [ targetCategory, ...initialFilterCategories ]);
          });
        });

        describe("toggling a category that is filtered", () => {
          test("should toggle off just the category", () => {
            const [ _otherCategory, ...initialFilterCategories ] = initialCategories;
            const [ targetCategory, ...rest ] = initialFilterCategories;

            const state = createCategoryFilterTogglingRootState(
              initialFilterCategories, 
              initialAlbums,
            );
            
            const store = setupStore(state);

            store.dispatch(toggleFilterCategorySingle(targetCategory));
            const result = selectFilterCategories(store.getState());

            expect(result).not.toEqual(initialFilterCategories);
            expect(result).not.toEqual(CATEGORY_ALL);

            expect(result).not.toContain(targetCategory);
            expect(result).not.toContain(_otherCategory);
            expectEqualFilterCategories(result, rest);
          });
        });
      });
    });
  });
});

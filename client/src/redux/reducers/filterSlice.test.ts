import { describe, expect, test } from "@jest/globals";
import reducer, { FilterState, removeFilterCategoryIfSubsetSelected, setSort, toggleFilterCategory } from "./filterSlice";
import { AlbumColumn, Order } from "../../types";
import { CATEGORY_ALL } from "../../constants";
import { categories } from "../../../test/constants";

const initialState: FilterState = {
  sortColumn: AlbumColumn.ARTIST,
  sortOrder: Order.ASC,
  
  column: AlbumColumn.ARTIST,
  text: '',
  publishInterval: { start: undefined, end: undefined },
  addDateInterval: { start: '', end: '' },

  categories: CATEGORY_ALL,
};

const createFilterState = (filters: Partial<FilterState>): FilterState => {
  return { ...initialState, ...filters };
};

const createSortingFilterState = (sortColumn: AlbumColumn, sortOrder: Order) => {
  return createFilterState({ sortColumn, sortOrder });
};

const createCategoryFilterState = (categories: FilterState["categories"]) => {
  return createFilterState({ categories });
};

describe("Filter slice", () => {
  describe("reducers", () => {
    describe("set sort", () => {
      test("sorting without changing column toggles sorting order", () => {
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

      test("changing column does not change sorting order", () => {
        const sortColumn = AlbumColumn.ARTIST;
        const sortOrder = Order.ASC;
        const previousState = createSortingFilterState(sortColumn, sortOrder);
        
        const currentState = reducer(previousState, setSort(AlbumColumn.ALBUM));
        expect(currentState.sortColumn).toBe(AlbumColumn.ALBUM);
        expect(currentState.sortOrder).toBe(sortOrder);
      });
    });

    describe("toggle filter category", () => {
      describe("toggle all", () => {
        const targetCategory = CATEGORY_ALL;

        test.each<[FilterState["categories"]]>([ [[]], [[categories[0]]] ])
        ("can toggle all categories when %o is selected", (initialCategory) => {
          const previousState = createCategoryFilterState(initialCategory);
          const currentState = reducer(previousState, toggleFilterCategory({
            category: targetCategory, categories,
          }));
          
          expect(currentState.categories).toBe(CATEGORY_ALL);
          const nextState = reducer(currentState, toggleFilterCategory({
            category: targetCategory, categories,
          }));

          expect(nextState.categories).toHaveLength(0);
        });
      });

      describe("toggle single", () => {
        describe("when all are selected", () => {
          const initialCategory = CATEGORY_ALL;

          test("all categories are selected except the one toggled", () => {
            const targetCategory = categories[1];

            const previousState = createCategoryFilterState(initialCategory);
            const currentState = reducer(previousState, toggleFilterCategory({
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
              const previousState = createCategoryFilterState(rest);

              const currentState = reducer(previousState, toggleFilterCategory({
                category: targetCategory, categories,
              }));

              expect(currentState.categories).toBe(CATEGORY_ALL);
            });

            test("if it is not the only one missing, then just it is added", () => {
              const [targetCategory, otherCategory, ...rest] = categories;
              const previousState = createCategoryFilterState(rest);

              const currentState = reducer(previousState, toggleFilterCategory({
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
            const previousState = createCategoryFilterState([ first, second, third ]);

            const currentState = reducer(previousState, toggleFilterCategory({
              category: targetCategory, categories,
            }));

            expect(currentState.categories).not.toContain(targetCategory);
            expect(currentState.categories).toStrictEqual([first, third]);
          });
        });
      });
    });

    describe("remove filter category if subset selected", () => {
      test("if all categories are selected, then state does not change", () => {
        const targetCategory = categories[1];

        const previousState = createCategoryFilterState(CATEGORY_ALL);
        const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
          category: targetCategory, categories,
        }));

        expect(currentState).toStrictEqual(previousState);
      });

      describe("when all categories are not selected", () => {
        const [targetCategory, ...otherCategories] = categories;
        const otherCategory = otherCategories[0];

        describe("when removed category is filtered", () => {
          describe("when it is the only category in the filter", () => {
            test("when just a single category exists, all categories are filtered", () => {
              const previousState = createCategoryFilterState([targetCategory]);
              const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
                category: targetCategory, categories: [targetCategory],
              }));

              expect(currentState.categories).toBe(CATEGORY_ALL);
            });

            test("when multiple categories exists, none are filtered", () => {
              const previousState = createCategoryFilterState([targetCategory]);
              const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
                category: targetCategory, categories,
              }));

              expect(currentState.categories).toHaveLength(0);
            });
          });

          test("when other categories are included in the filter, only these categories remain", () => {
            const previousState = createCategoryFilterState([targetCategory, otherCategory]);
            const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
              category: targetCategory, categories,
            }));

            expect(currentState.categories).toStrictEqual([otherCategory]);
          });
        });

        describe("when removed category is not filtered", () => {
          test("when just a single category exists, all categories are filtered", () => {
            const previousState = createCategoryFilterState([]);
            const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
              category: targetCategory, categories: [targetCategory],
            }));

            expect(currentState.categories).toBe(CATEGORY_ALL);
          });

          describe("when two categories exists", () => {
            test("when no categories are filtered, nothing changes", () => {
              const previousState = createCategoryFilterState([]);
              const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
                category: targetCategory, categories: [targetCategory, otherCategory],
              }));
  
              expect(currentState).toStrictEqual(previousState);
            });

            test("when just the other category is filtered, all categories are filtered", () => {
              const previousState = createCategoryFilterState([otherCategory]);
              const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
                category: targetCategory, categories: [targetCategory, otherCategory],
              }));
  
              expect(currentState.categories).toBe(CATEGORY_ALL);
            });
          });

          describe("when multiple categories exists", () => {
            test("when all other categories are filtered, all categories are filtered", () => {
              const previousState = createCategoryFilterState(otherCategories);
              const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
                category: targetCategory, categories,
              }));

              expect(currentState.categories).toBe(CATEGORY_ALL);
            });

            test("when a single category is filtered, nothing changes", () => {
              const previousState = createCategoryFilterState([otherCategory]);
              const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
                category: targetCategory, categories,
              }));

              expect(currentState).toStrictEqual(previousState);
            });

            test("when no categories are filtered, nothing changes", () => {
              const previousState = createCategoryFilterState([]);
              const currentState = reducer(previousState, removeFilterCategoryIfSubsetSelected({
                category: targetCategory, categories,
              }));

              expect(currentState).toStrictEqual(previousState);
            });
          });
        });
      });
    });
  });
});

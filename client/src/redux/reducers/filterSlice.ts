import { PayloadAction, ThunkAction, UnknownAction, createSlice } from '@reduxjs/toolkit';
import { AlbumColumn, Interval, Order } from '../../types';
import { RootState } from '../store';
import { CATEGORY_ALL } from '../../constants';
import { selectCategories } from './albumsSlice';

export interface FilterState {
  // sorting
  sortColumn: AlbumColumn;
  sortOrder: Order;

  // filters
  column: AlbumColumn;
  text: string;
  publishInterval: Interval<number | undefined>;
  addDateInterval: Interval<string>;

  categories: string[] | typeof CATEGORY_ALL;
}

export const initialState: FilterState = {
  sortColumn: AlbumColumn.ARTIST,
  sortOrder: Order.ASC,
  
  column: AlbumColumn.ARTIST,
  text: '',
  publishInterval: { start: undefined, end: undefined },
  addDateInterval: { start: '', end: '' },

  categories: CATEGORY_ALL,
};

interface CategoryPayload {
  category: string,
  categories: string[];
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilterColumn: (state, action: PayloadAction<AlbumColumn>) => {
      const newColumn = action.payload;
      state.column = newColumn;
    },
    setSort: (state, action: PayloadAction<AlbumColumn>) => {
      const newSortColumn = action.payload;
      if (newSortColumn === state.sortColumn) {
        state.sortOrder = (state.sortOrder === Order.ASC) ? Order.DESC : Order.ASC;
      }
      state.sortColumn = newSortColumn;
    },
    setFilterText: (state, action: PayloadAction<string>) => {
      const text = action.payload;
      state.text = text;
    },
    setFilterPublishInterval: (state, action: PayloadAction<Interval<number | undefined>>) => {
      const interval = action.payload;
      state.publishInterval = interval;
    },
    setFilterAddDateInterval: (state, action: PayloadAction<Interval<string>>) => {
      const interval = action.payload;
      state.addDateInterval = interval;
    },
    /**
     * @remark does not reset {@link FilterState.column}
     * @param state 
     */
    resetColumnFilters: (state) => {
      state.text = initialState.text;
      state.publishInterval = initialState.publishInterval;
      state.addDateInterval = initialState.addDateInterval;
    },

    setFilterCategories: (state, action: PayloadAction<FilterState["categories"]>) => {
      const categories = action.payload;
      state.categories = categories;
    },

    toggleFilterCategoryAll: (state) => {
      state.categories = (state.categories !== CATEGORY_ALL)
        ? CATEGORY_ALL
        : [];
    },

    /*
    toggleFilterCategory: (state, action: PayloadAction<CategoryPayload>) => {
      const { category, categories } = action.payload;

      if (category === CATEGORY_ALL) {
        // toggle all on/off
        state.categories = (state.categories === CATEGORY_ALL) ? [] : CATEGORY_ALL;

      } else {
        // toggle single on/off

        if (state.categories === CATEGORY_ALL) {
          // all categories was selected previously, so set all categories except one
          state.categories = categories.filter(c => c !== category);
    
        } else {
          const selectedCategories = state.categories;
          
          if (!selectedCategories.includes(category)) {
            // add one

            const setAll = justOneCategoryMissing(category, selectedCategories, categories);

            state.categories = setAll
              ? CATEGORY_ALL
              : [ ...selectedCategories, category ];
      
          } else {
            // remove one
            state.categories = selectedCategories.filter(c => c !== category);
          }
        }
      }
    },
    */

    /**
     * Used to update filtered categories state then editing or removing an album
     * results in a category being deleted from the albums list
     * 
     * @param state 
     * @param action 
     */
    removeFilterCategoryIfSubsetSelected: (state, action: PayloadAction<CategoryPayload>) => {
      const { category, categories } = action.payload;
      if (state.categories !== CATEGORY_ALL) {
        const newSelectedCategories = state.categories.filter(c => c !== category);

        const setAll = justOneCategoryMissing(category, newSelectedCategories, categories);

        state.categories = setAll
          ? CATEGORY_ALL
          : newSelectedCategories;
      }
    },
  },
});

/**
 * 
 * @param value 
 * @param first 
 * @param second 
 * @returns true the arrays have the same elements (also the same number),
 *          when parameter value is appended to the first array
 */
const justOneCategoryMissing = (value: string, first: string[], second: string[]) => {
  if (first.length + 1 !== second.length) return false;

  const source = [ ...first, value ].toSorted();
  const target = second.toSorted();

  for (let i = 0; i < target.length; i++) {
    if (source[i] !== target[i]) return false;
  }

  return true;
};

export const {
  setFilterColumn, setSort, setFilterText, setFilterPublishInterval, setFilterAddDateInterval, resetColumnFilters,
  setFilterCategories, toggleFilterCategoryAll, removeFilterCategoryIfSubsetSelected,
} = filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;
export const selectFilterCategories = (state: RootState) => state.filters.categories;

export const selectIsCategoryFiltered = (state: RootState, category: string) => {
  const categories = selectFilterCategories(state);

  return (categories !== CATEGORY_ALL)
    ? categories.find(c => c === category) !== undefined
    : true;
};

export const selectIsAllCategoriesFiltered = (state: RootState) =>
  selectFilterCategories(state) === CATEGORY_ALL;

export const toggleFilterCategorySingle = (category: string): ThunkAction<
  void,
  RootState,
  unknown,
  UnknownAction
> => (dispatch, getState) => {

  const rootState = getState();
  const allCategories = selectCategories(rootState);
  const filterCategories = selectFilterCategories(rootState);
  const isFiltered = selectIsCategoryFiltered(rootState, category);

  if (filterCategories === CATEGORY_ALL) {
    // all categories was selected previously, so set all categories except one
    dispatch(setFilterCategories(allCategories.filter(c => c !== category)));

  } else {
    if (isFiltered) {
      // remove one
      dispatch(setFilterCategories(filterCategories.filter(c => c !== category)));
      
    } else {
      // add one
      const setAll = justOneCategoryMissing(category, filterCategories, allCategories);
      if (setAll) {
        dispatch(setFilterCategories(CATEGORY_ALL));
      } else {
        dispatch(setFilterCategories([ ...filterCategories, category ]));
      }
    }
  }
};

export default filtersSlice.reducer;

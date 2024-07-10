import { PayloadAction, ThunkAction, UnknownAction, createSlice } from '@reduxjs/toolkit';
import { AlbumColumn, Interval, Order } from '../../../types';
import { RootState } from '../../store';
import { CATEGORY_ALL } from '../../../constants';
import { selectAlbumCategories } from '../albums/albumsSlice';

export type Sort = {
  column: AlbumColumn;
  order: Order;
};

export type FilterInterval = Interval<string>;
export type FilterCategories = string[] | typeof CATEGORY_ALL;

export type Filter = {
  column: AlbumColumn;
  text: string;
  published: FilterInterval;

  // the string must be in a valid ISO 8601 format (YYYY-MM-DD), or empty
  addDate: FilterInterval;
  categories: FilterCategories;
};

export interface FilterState {
  sorting: Sort;
  filters: Filter;
};

export const initialState: FilterState = {
  sorting: {
    column: AlbumColumn.ARTIST,
    order: Order.ASC,
  },
  filters: {
    column: AlbumColumn.ARTIST,
    text: "",
    published: { start: "", end: "" },
    addDate: { start: "", end: "" },
    categories: CATEGORY_ALL,
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<AlbumColumn>) => {
      const newSortColumn = action.payload;
      if (newSortColumn === state.sorting.column) {
        state.sorting.order = (state.sorting.order === Order.ASC) ? Order.DESC : Order.ASC;
      }
      state.sorting.column = newSortColumn;
    },
    setFilteringColumn: (state, action: PayloadAction<AlbumColumn>) => {
      const newColumn = action.payload;
      state.filters.column = newColumn;
    },
    setFilteringText: (state, action: PayloadAction<string>) => {
      const text = action.payload;
      state.filters.text = text;
    },
    setFilteringPublished: (state, action: PayloadAction<FilterInterval>) => {
      const interval = action.payload;
      state.filters.published = interval;
    },
    setFilteringAddDate: (state, action: PayloadAction<FilterInterval>) => {
      const interval = action.payload;
      state.filters.addDate = interval;
    },
    resetFilteringColumn: (state) => {
      const { column } = state.filters;
      switch (column) {
        case AlbumColumn.ARTIST:
        case AlbumColumn.ALBUM:
          state.filters.text = initialState.filters.text;
          break;
        case AlbumColumn.PUBLISHED:
          state.filters.published = initialState.filters.published;
          break;
        case AlbumColumn.ADD_DATE:
          state.filters.addDate = initialState.filters.addDate;
          break;
      }
    },
    setFilteringCategories: (state, action: PayloadAction<FilterCategories>) => {
      const categories = action.payload;
      state.filters.categories = categories;
    },
    toggleFilteringCategoryAll: (state) => {
      state.filters.categories = (state.filters.categories !== CATEGORY_ALL)
        ? CATEGORY_ALL
        : [];
    },
    removeFilteringCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.filters.categories !== CATEGORY_ALL) {
        state.filters.categories = state.filters.categories.filter(
          c => c !== category
        );
      }
    },
  },
});

export const {
  setFilteringColumn, setSort, setFilteringText, setFilteringPublished, 
  setFilteringAddDate, resetFilteringColumn, setFilteringCategories, 
  toggleFilteringCategoryAll, removeFilteringCategory,
} = filtersSlice.actions;

export default filtersSlice.reducer;

// SELECTORS

/**
 * Select sorting options
 * @param state 
 * @returns 
 */
export const selectSorting = (state: RootState) => state.filters.sorting;

/**
 * Select raw filtering options. Used in controlled inputs.
 * @param state 
 * @returns 
 */
export const selectFilters = (state: RootState) => state.filters.filters;

/**
 * Select filtering categories
 * @param state 
 * @returns 
 */
export const selectFilterCategories = (state: RootState) => selectFilters(state).categories;

/**
 * Selector for checking if a given category is included in the category filter
 * @param state 
 * @param category 
 * @returns 
 */
export const selectIsCategoryFiltered = (state: RootState, category: string) => {
  const categories = selectFilterCategories(state);

  return (categories !== CATEGORY_ALL)
    ? categories.find(c => c === category) !== undefined
    : true;
};

/**
 * Selector for checking if all categories option is toggled on in the filter
 * 
 * @remarks Does not check the case where all categories are toggled on separately
 * 
 * @param state 
 * @returns 
 */
export const selectIsAllCategoriesFiltered = (state: RootState) =>
  selectFilterCategories(state) === CATEGORY_ALL;

// THUNKS

/**
 * Thunk for toggling a single filter category on/off
 * @param category 
 * @returns 
 */
export const toggleFilterCategorySingle = (category: string): ThunkAction<
  void,
  RootState,
  unknown,
  UnknownAction
> => (dispatch, getState) => {

  const rootState = getState();
  const albumCategories = selectAlbumCategories(rootState);
  const filterCategories = selectFilterCategories(rootState);
  const isFiltered = selectIsCategoryFiltered(rootState, category);

  if (filterCategories === CATEGORY_ALL) {
    // all categories was selected previously, so set all categories except one
    dispatch(setFilteringCategories(albumCategories.filter(c => c !== category)));

  } else {
    if (isFiltered) {
      // remove one
      dispatch(setFilteringCategories(filterCategories.filter(c => c !== category)));
      
    } else {
      // add one
      dispatch(setFilteringCategories([ ...filterCategories, category ]));
    }
  }
};

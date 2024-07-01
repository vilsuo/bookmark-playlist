import { PayloadAction, ThunkAction, UnknownAction, createSlice } from '@reduxjs/toolkit';
import { AlbumColumn, Interval, Order } from '../../types';
import { RootState } from '../store';
import { CATEGORY_ALL } from '../../constants';
import { selectCategories } from './albumsSlice';

export type Sort = {
  column: AlbumColumn;
  order: Order;
};

export type FilterInterval = Interval<string>;

export type Filter = {
  column: AlbumColumn;

  text: string;
  published: FilterInterval;
  addDate: FilterInterval;

  categories: string[] | typeof CATEGORY_ALL;
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
  }
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
    resetFilteringFields: (state) => {
      state.filters.text = initialState.filters.text;
      state.filters.published = initialState.filters.published;
      state.filters.addDate = initialState.filters.addDate;
    },
    setFilteringCategories: (state, action: PayloadAction<Filter["categories"]>) => {
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
  setFilteringColumn, setSort, setFilteringText, setFilteringPublished, setFilteringAddDate, resetFilteringFields,
  setFilteringCategories, toggleFilteringCategoryAll, removeFilteringCategory,
} = filtersSlice.actions;

export const selectSorting = (state: RootState) => state.filters.sorting;

export const selectFilters = (state: RootState) => state.filters.filters;

export const selectFilterCategories = (state: RootState) => state.filters.filters.categories;

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
    dispatch(setFilteringCategories(allCategories.filter(c => c !== category)));

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

export default filtersSlice.reducer;

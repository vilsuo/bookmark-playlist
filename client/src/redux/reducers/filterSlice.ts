import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AlbumColumn, Interval, Order } from '../../types';
import { RootState } from '../store';

export interface FilterState {
  column: AlbumColumn;
  order: Order;
  text: string;
  publishInterval: Interval<number | undefined>;
  addDateInterval: Interval<string>;
}

const initialState: FilterState = {
  column: AlbumColumn.ARTIST,
  order: Order.ASC,
  text: '',
  publishInterval: { start: undefined, end: undefined },
  addDateInterval: { start: '', end: '' },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilterColumn: (state, action: PayloadAction<AlbumColumn>) => {
      const column = action.payload;
      state.column = column;
    },
    setSort: (state, action: PayloadAction<AlbumColumn>) => {
      const column = action.payload;
      if (column === state.column) {
        state.order = (state.order === Order.ASC ? Order.DESC : Order.ASC);
      }
      state.column = column;
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
    resetFilters: (state) => {
      return { ...initialState, column: state.column };
    },
  },
});

export const { setFilterColumn, setSort, setFilterText, setFilterPublishInterval, setFilterAddDateInterval, resetFilters } =
  filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;

export default filtersSlice.reducer;

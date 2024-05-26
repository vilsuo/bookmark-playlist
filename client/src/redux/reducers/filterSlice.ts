import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AlbumColumn, Interval } from '../../types';
import { RootState } from '../store';

export interface FilterState {
  column: AlbumColumn;
  text: string;
  publishInterval: Interval<number | undefined>;
  addDateInterval: Interval<string>;
}

const initialState: FilterState = {
  column: AlbumColumn.ARTIST,
  text: '',
  publishInterval: { start: undefined, end: undefined },
  addDateInterval: { start: '', end: '' },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    selectFilterColumn: (state, action: PayloadAction<AlbumColumn>) => {
      const column = action.payload;
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

export const { selectFilterColumn, setFilterText, setFilterPublishInterval, setFilterAddDateInterval, resetFilters } =
  filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;

export default filtersSlice.reducer;

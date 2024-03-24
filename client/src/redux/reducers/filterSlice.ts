import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AlbumColumn, Interval } from '../../types';
import { RootState } from '../store';

export interface FilterState {
  column: AlbumColumn;
  text: string;
  interval: Interval;
}

const initialState: FilterState = {
  column: AlbumColumn.ARTIST,
  text: '',
  interval: { start: '', end: '' },
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
    setFilterInterval: (state, action: PayloadAction<Interval>) => {
      const interval = action.payload;
      state.interval = interval;
    },
  },
});

export const { selectFilterColumn, setFilterText, setFilterInterval } =
  filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;

export default filtersSlice.reducer;

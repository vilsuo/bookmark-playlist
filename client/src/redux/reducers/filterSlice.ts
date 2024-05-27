import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Album, AlbumColumn, Interval, Order } from '../../types';
import { RootState } from '../store';
import { parseDateInterval } from '../../util/dateConverter';

export interface FilterState {
  // sorting
  sortColumn: AlbumColumn;
  sortOrder: Order;

  // filters
  column: AlbumColumn;
  text: string;
  publishInterval: Interval<number | undefined>;
  addDateInterval: Interval<string>;
}

const initialState: FilterState = {
  sortColumn: AlbumColumn.ARTIST,
  sortOrder: Order.ASC,
  
  column: AlbumColumn.ARTIST,
  text: '',
  publishInterval: { start: undefined, end: undefined },
  addDateInterval: { start: '', end: '' },
};

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
        state.sortOrder = (state.sortOrder === Order.ASC ? Order.DESC : Order.ASC);
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
    resetFilters: (state) => {
      return { ...initialState, column: state.column };
    },
  },
});

export const { setFilterColumn, setSort, setFilterText, setFilterPublishInterval, setFilterAddDateInterval, resetFilters } =
  filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;

export default filtersSlice.reducer;

/**
 * Create a {@link Album} sorting funtion. The sorting function will sort
 * the albums naturally by the given property and order, with the following
 * exceptions regarding the sorting column:
 *
 * {@link AlbumColumn.ARTIST}: If two {@link Album.artist} are equal, then
 * the album with greater {@link Album.published} value will ALWAYS be first
 * regardless of given {@link Order}.
 *
 * {@link AlbumColumn.ALBUM}: If two {@link Album.title} are equal, then
 * the album with earlier {@link Album.artist} value will ALWAYS be first
 * regardless of given {@link Order}.
 *
 * {@link AlbumColumn.PUBLISHED}: If two {@link Album.published} are equal,
 * then the album with earlier {@link Album.artist} value will ALWAYS be first
 * regardless of given {@link Order}.
 * 
 * {@link AlbumColumn.ADD_DATE}: Sort by {@link Album.addDate}.
 *
 * @param sortColumn name of the current column to sort by
 * @param sortOrder the sorting order
 * @returns the sorting function
 */
export const getSortFn =
  (sortColumn: AlbumColumn, sortOrder: Order) => (a: Album, b: Album) => {
    // Note: return -1 if album 'a' goes before album 'b'

    const aArtist = a.artist.toLowerCase();
    const bArtist = b.artist.toLowerCase();

    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();

    switch (sortColumn) {
      case AlbumColumn.ARTIST: {
        if (aArtist === bArtist) {
          return b.published - a.published;
        }
        return sortOrder * (aArtist < bArtist ? -1 : 1);
      }
      case AlbumColumn.ALBUM: {
        if (aTitle === bTitle) {
          return aArtist < bArtist ? -1 : 1;
        }
        return sortOrder * (aTitle < bTitle ? -1 : 1);
      }
      case AlbumColumn.PUBLISHED: {
        if (a.published === b.published) {
          return aArtist < bArtist ? -1 : 1;
        }
        return sortOrder * (a.published - b.published);
      }
      case AlbumColumn.ADD_DATE: {
        return sortOrder * ((new Date(a.addDate) > new Date(b.addDate)) ? 1 : -1);
      }
      default:
        sortColumn satisfies never;
        return 1;
    };
  };

/**
 * Create a {@link Album} filter function.
 *
 * @param filterState current filter options. The filters are only applied to the
 * property specified by {@link FilterState.column}.
 * @returns the filter funtion
 */
export const getFilterFn = (filterState: FilterState) => (album: Album) => {
  const { text, column, publishInterval, addDateInterval } = filterState;

  switch (column) {
    case AlbumColumn.ARTIST:
    case AlbumColumn.ALBUM: {
      // filter only by text value, select album artist or title
      if (!text) return true;

      const searchText = text.toLowerCase();
      if (column === AlbumColumn.ARTIST) {
        return album.artist.toLowerCase().indexOf(searchText) !== -1;
      } else {
        return album.title.toLowerCase().indexOf(searchText) !== -1;
      }
    }
    case AlbumColumn.PUBLISHED: {
      // filter only by published
      const { published } = album;
      const { start, end } = publishInterval;

      if (start === undefined && end === undefined) {
        return true; // no interval filter

      } else if (start !== undefined && end !== undefined) {
        return Number(start) <= published && published <= Number(end);

      } else if (start !== undefined) {
        return published >= Number(start);
        
      } else {
        // end !== undefined
        return published <= Number(end);
      }
    }
    case AlbumColumn.ADD_DATE: {
      // filter only by addDate
      const date = new Date(album.addDate);
      const { startDate, endDate } = parseDateInterval(addDateInterval);

      if (startDate && endDate) {
        return startDate <= date && date < endDate;

      } else if (startDate) {
        return date >= startDate;

      } else if (endDate) {
        return date < endDate;

      } else {
        return true; // no interval filter
      }
    }
    default:
      column satisfies never;
      return true;
  };
};

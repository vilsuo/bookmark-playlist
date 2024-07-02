import { CATEGORY_ALL } from "../../../constants";
import { Sort, selectSorting } from "../filters/filterSlice";
import { Album, AlbumColumn } from "../../../types";
import { ParsedAddDateFilterInterval, ParsedFilter, ParsedPublishedFilterInterval, selectParsedFilters } from "../filters/parsers";
import { createSelector } from "@reduxjs/toolkit";
import { selectAlbums } from "./albumsSlice";

/**
 * Creates a memoized selector for selecting all albums based on the current
 * filters and sorting orders
 */
export const selectSortedAndFilteredAlbums = createSelector(
  selectAlbums,
  selectSorting,
  selectParsedFilters,
  (albums, sorting, parsedFilters) => {
    return albums
      .filter(getFilterFn(parsedFilters))
      .toSorted(getSortFn(sorting));
  },
);

/**
 * Create a album filter function.
 *
 * @param filters current filter options. The filter categories are always applied. 
 * The only other applied filter is specified by filter column.
 * @returns
 */
const getFilterFn = (filters: ParsedFilter) => (album: Album) => {
  const {
    column,
    text,
    published: publishInterval,
    addDate: addDateInterval,
    categories
  } = filters;

  if (categories !== CATEGORY_ALL && !categories.includes(album.category)) {
    return false;
  }

  switch (column) {
    case AlbumColumn.ARTIST:
    case AlbumColumn.ALBUM: {
      // filter only by text value, select album artist or title
      return filterByText(text, column, album);
    }
    case AlbumColumn.PUBLISHED: {
      return filterByPublished(publishInterval, album);
    }
    case AlbumColumn.ADD_DATE: {
      return filterByAddDate(addDateInterval, album);
    }
    default:
      column satisfies never;
      return true;
  };
};

const filterByText = (text: string, column: AlbumColumn, album: Album) => {
  if (!text) return true;

  const searchText = text.toLowerCase();
  if (column === AlbumColumn.ARTIST) {
    return album.artist.toLowerCase().indexOf(searchText) !== -1;
  } else {
    return album.title.toLowerCase().indexOf(searchText) !== -1;
  }
};

const filterByPublished = ({ start, end }: ParsedPublishedFilterInterval, album: Album) => {
  const { published } = album;

  if (start === undefined && end === undefined) {
    return true; // no interval filter

  } else if (start !== undefined && end !== undefined) {
    return start <= published && published <= end;

  } else if (start !== undefined) {
    return published >= start;
    
  } else {
    // end !== undefined
    return published <= end!;
  }
};

const filterByAddDate = ({ start, end }: ParsedAddDateFilterInterval, album: Album) => {
  const date = new Date(album.addDate);

  if (start && end) {
    return start <= date && date < end;

  } else if (start) {
    return date >= start;

  } else if (end) {
    return date < end;

  } else {
    return true; // no interval filter
  }
};

/**
 * Create an album sorting funtion. The sorting function will sort
 * the albums by the given column and order, with the following
 * exceptions regarding the column:
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
 * @param column the album property to sort by
 * @param order the sorting order
 * @returns
 */
const getSortFn = ({ column, order }: Sort) => (a: Album, b: Album) => {
  // Note: return -1 if album 'a' goes before album 'b'

  const aArtist = a.artist.toLowerCase();
  const bArtist = b.artist.toLowerCase();

  const aTitle = a.title.toLowerCase();
  const bTitle = b.title.toLowerCase();
  switch (column) {
    case AlbumColumn.ARTIST: {
      if (aArtist === bArtist) {
        return b.published - a.published;
      }
      return order * (aArtist < bArtist ? -1 : 1);
    }
    case AlbumColumn.ALBUM: {
      if (aTitle === bTitle) {
        return aArtist < bArtist ? -1 : 1;
      }
      return order * (aTitle < bTitle ? -1 : 1);
    }
    case AlbumColumn.PUBLISHED: {
      if (a.published === b.published) {
        return aArtist < bArtist ? -1 : 1;
      }
      return order * (a.published - b.published);
    }
    case AlbumColumn.ADD_DATE: {
      return order * ((new Date(a.addDate) > new Date(b.addDate)) ? 1 : -1);
    }
    default:
      column satisfies never;
      return 1;
  };
};

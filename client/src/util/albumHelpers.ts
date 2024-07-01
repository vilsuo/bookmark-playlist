import { CATEGORY_ALL } from "../constants";
import { Filter, FilterInterval, Sort } from "../redux/reducers/filterSlice";
import { Album, AlbumColumn, Interval } from "../types";
import { resetHours } from "./dateConverter";

/**
 * 
 * @param albums array to choose from
 * @param currentAlbum the given album
 * @returns null if album list is empty or the album is the last album;
 * the first album in the list if album is not given or not found in the list;
 * else the album after the given album in the array
 */
export const getNextAlbumInSequence = (albums: Album[], currentAlbum: Album | null) => {
  // no albums and/or match the filter
  if (!albums.length) { return null; }

  // no album selected, play the first
  if (!currentAlbum) { return albums[0]; }

  const playingAlbumIdx = albums.findIndex((album) => album.id === currentAlbum.id);
  if (playingAlbumIdx === -1) {
    // album not found, user likely changed filters...
    return albums[0];

  } else if (playingAlbumIdx === albums.length - 1) {
    // reached the end of the list
    return null;

  } else {
    // return next in sequence
    return albums[playingAlbumIdx + 1];
  }
};

export const getRandomAlbum = (albums: Album[]) => albums.length
  ? albums[Math.floor(albums.length * Math.random())]
  : null;

/**
 * Create a {@link Album} sorting funtion. The sorting function will sort
 * the albums by the given property and order, with the following
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
 * @param column the column to sort by
 * @param order the sorting order
 * @returns the sorting function
 */
export const getSortFn =
  ({ column, order }: Sort) => (a: Album, b: Album) => {
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

/**
 * Create a {@link Album} filter function.
 *
 * @param filterState current filter options. The filter {@link FilterState.categories} is
 * always applied. The only other applied filter is specified by {@link FilterState.column}.
 * @returns the filter funtion
 */
export const getFilterFn = (filters: Filter) => (album: Album) => {
  const {
    column,
    text,
    published: publishInterval,
    addDate: addDateInterval,
    categories
  } = filters;

  if (categories !== CATEGORY_ALL && !categories.includes(album.category)) return false;

  switch (column) {
    case AlbumColumn.ARTIST:
    case AlbumColumn.ALBUM: {
      // filter only by text value, select album artist or title
      return filterByText(text, column, album);
    }
    case AlbumColumn.PUBLISHED: {
      return filterByPublished(parsePublishInterval(publishInterval), album);
    }
    case AlbumColumn.ADD_DATE: {
      return filterByAddDate(parseDateInterval(addDateInterval), album);
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

const filterByPublished = (
  { start, end }: ReturnType<typeof parsePublishInterval>,
  album: Album,
) => {
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

const filterByAddDate = (
  { start, end }: ReturnType<typeof parseDateInterval>,
  album: Album,
) => {
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
 * Convert string interval to number interval to be used in filtering
 * 
 * @remarks empty string is converter to undefined
 * 
 * @param interval number strings
 * @returns start: interval start published, end: interval end published
 */
const parsePublishInterval = (interval: FilterInterval)
: Interval<number | undefined> => {
  const { start, end } = interval;
  
  const startPublish = start ? Number(start) : undefined;
  const endPublish = end ? Number(end) : undefined;

  return { start: startPublish, end: endPublish };
};

/**
 * Convert string date interval to date interval to be used in filtering
 * 
 * @remarks empty string is converter to undefined
 * 
 * @param interval Date strings
 * @returns start: interval start date with hour|min|sec|mm set to 0,
 * end: the next date of interval end date with hour|min|sec|mm set to 0
 */
const parseDateInterval = (interval: FilterInterval)
: Interval<Date | undefined> => {
  const { start, end } = interval;

  const startDate = start ? new Date(start) : undefined;
  if (startDate) {
    resetHours(startDate);
  }

  const endDate = end ? new Date(end) : undefined;
  if (endDate) {
    resetHours(endDate);
    endDate.setDate(endDate.getDate() + 1);
  }

  return { start: startDate, end: endDate };
};

import { CATEGORY_ALL } from "../constants";
import { FilterState } from "../redux/reducers/filterSlice";
import { Album, AlbumColumn, Order } from "../types";
import { parseDateInterval } from "./dateConverter";

/**
 * 
 * @param albums array to choose from
 * @param currentAlbum the given album
 * @returns null if album list is empty or the album is the last album;
 * the first album in the list if album is not given or not found in the list;
 * else the album after the given album
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

/**
 * 
 * @param albums 
 * @returns random album from the list if it is not empty
 */
export const getRandomAlbum = (albums: Album[]) => albums.length ? albums[Math.floor(albums.length * Math.random())] : null;

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
 * @param filterState current filter options. The filters except {@link FilterState.categories}
 * are only applied to the property specified by {@link FilterState.column}.
 * @returns the filter funtion
 */
export const getFilterFn = (filterState: FilterState) => (album: Album) => {
  const { text, column, publishInterval, addDateInterval, categories } = filterState;

  if (categories !== CATEGORY_ALL && !categories.includes(album.category)) return false;

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

import { useEffect, useState } from 'react';
import { Album, AlbumColumn, Order } from '../../types';
import AlbumRow from './AlbumRow';
import SortableColumn from '../general/SortableColumn';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { FilterState, selectFilters, setSort } from '../../redux/reducers/filterSlice';
import { parseDateInterval } from '../../util/dateConverter';

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
const getSortFn =
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
const getFilterFn = (filterState: FilterState) => (album: Album) => {
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

interface AlbumTableProps {
  albums: Album[];
  playingAlbum: Album | null;
  viewingAlbum: Album | null;
  setViewingAlbum: (album: Album | null) => void;
}

const AlbumTable = ({
  albums,
  playingAlbum,
  viewingAlbum,
  setViewingAlbum,
}: AlbumTableProps) => {
  const [sortedAlbums, setSortedAlbums] = useState<Album[]>([]);

  const filterState = useAppSelector(selectFilters);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setSortedAlbums(
      albums
        .filter(getFilterFn(filterState))
        .toSorted(getSortFn(filterState.column, filterState.order))
    );
  }, [albums, filterState]);

  const isPlaying = (album: Album) => {
    return playingAlbum !== null && playingAlbum.videoId === album.videoId;
  };

  const isViewing = (album: Album) => {
    return viewingAlbum !== null && viewingAlbum.videoId === album.videoId;
  };

  const handleSortChange = (column: AlbumColumn) => {
    dispatch(setSort(column));
  };

  return (
    <table className="album-table">
      <thead>
        <tr>
          {[AlbumColumn.ARTIST, AlbumColumn.ALBUM, AlbumColumn.PUBLISHED, AlbumColumn.ADD_DATE].map(
            (col) => (
              <SortableColumn
                key={col}
                value={col}
                setValue={handleSortChange}
                sortColumn={filterState.column}
                sortOrder={filterState.order}
              />
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {sortedAlbums.map((album) =>
          <AlbumRow
            key={album.videoId}
            album={album}
            isPlayed={isPlaying(album)}
            isViewed={isViewing(album)}
            view={setViewingAlbum}
          />
        )}
      </tbody>
    </table>
  );
};

export default AlbumTable;

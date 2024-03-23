import { useState } from 'react';
import { Album, AlbumColumn, Order } from '../../types';
import AlbumRow from './AlbumRow';
import ExtraRow from './ExtraRow';
import SortableColumn from '../general/SortableColumn';
import { useAppSelector } from '../../redux/hooks';
import { FilterState, selectFilters } from '../../redux/reducers/filterSlice';

const getSortFn = (sortColumn: AlbumColumn, sortOrder: Order) => (a: Album, b: Album) => {
  // -1 if a before b

  const aArtist = a.artist.toLowerCase();
  const bArtist = b.artist.toLowerCase();

  const aTitle = a.title.toLowerCase();
  const bTitle = b.title.toLowerCase();

  if (sortColumn === AlbumColumn.ARTIST) {
    if (aArtist === bArtist) {
      return b.published - a.published;
    }

    return sortOrder * ((aArtist < bArtist) ? -1 : 1);
  } else if (sortColumn === AlbumColumn.ALBUM) {
    if (aTitle === bTitle) {
      return (aArtist < bArtist) ? -1 : 1;
    }

    return sortOrder * ((aTitle < bTitle) ? -1 : 1);
  } else {
    // published
    if (a.published === b.published) {
      return (aArtist < bArtist) ? -1 : 1;
    }
    return sortOrder * (a.published - b.published);
  }
}

const getFilterFn = (filterState: FilterState) => (album: Album) => {
  const { text, column, interval } = filterState;

  if (column !== AlbumColumn.PUBLISHED) {
    if (!text) return true;

    const searchText = text.toLowerCase();
    if (column === AlbumColumn.ARTIST) {
      return album.artist.toLowerCase().indexOf(searchText) !== -1;
    } else {
      return album.title.toLowerCase().indexOf(searchText) !== -1;
    }
  } else {
    const { published } = album;
    const { start, end } = interval;

    if (!start && !end) {
      // no filter
      return 1;
    } else if (start && end) {
      return Number(start) <= published && published <= Number(end);
    } else if (start) {
      return published >= Number(start);
    } else {
      return published <= Number(end);
    }
  }
};

interface AlbumTableProps {
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
}

const AlbumTable = ({ albums, playingAlbum, setPlayingAlbum } : AlbumTableProps) => {
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);

  const filterState = useAppSelector(selectFilters);

  const [sortColumn, setSortColumn] = useState<AlbumColumn>(AlbumColumn.ARTIST);
  const [sortOrder, setSortOrder] = useState<Order>(Order.ASC);

  const isPlaying = (album: Album) => {
    return playingAlbum !== null && playingAlbum.videoId === album.videoId;
  };

  const isViewed = (album: Album) => {
    return viewingAlbum !== null && viewingAlbum.videoId === album.videoId;
  };

  const handleSortChange = (colum: AlbumColumn) => {
    if (colum === sortColumn) {
      setSortOrder(sortOrder === Order.ASC ? Order.DESC : Order.ASC);
    }

    setSortColumn(colum);
  };

  const sortedAlbums = albums
    .filter(getFilterFn(filterState))
    .toSorted(getSortFn(sortColumn, sortOrder));

  return (
    <table className='album-table'>
      <thead>
        <tr>
          {[AlbumColumn.ARTIST, AlbumColumn.ALBUM, AlbumColumn.PUBLISHED].map(
            (col) => (
              <SortableColumn 
                key={col}
                value={col}
                setValue={handleSortChange}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
              />
            )
          )}
        </tr>
      </thead>
      <tbody>
        {sortedAlbums.map((album) =>
          !isViewed(album) ? (
            <AlbumRow key={album.videoId}
              album={album}
              isPlaying={isPlaying(album)}
              setViewingAlbum={setViewingAlbum}
            />
          ) : (
            <ExtraRow key={album.videoId}
              album={album}
              isPlaying={isPlaying(album)}
              setPlayingAlbum={setPlayingAlbum}
              close={() => setViewingAlbum(null)}
            />
          )
        )}
      </tbody>
    </table>
  );
};

export default AlbumTable;

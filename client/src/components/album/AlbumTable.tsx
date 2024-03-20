import { useState } from 'react';
import { Album, AlbumColumn, Order } from '../../types';
import AlbumRow from './AlbumRow';
import ExtraRow from './ExtraRow';
import { FilterOptions } from './AlbumFilter';
import SortableColumn from '../general/SortableColumn';

const getSortFn = (sortColumn: AlbumColumn, sortOrder: Order) => (a: Album, b: Album) => {
  const aArtist = a.artist.toLowerCase();
  const bArtist = b.artist.toLowerCase();

  const aTitle = a.title.toLowerCase();
  const bTitle = b.title.toLowerCase();

  if (sortColumn === AlbumColumn.ARTIST) {
    if (aArtist === bArtist) {
      return b.published - a.published;
    }

    return sortOrder * ((aArtist < bArtist) ? -1 : 1);
  } else {
    if (aTitle === bTitle) {
      return (aArtist < bArtist) ? -1 : 1;
    }

    return sortOrder * ((aTitle < bTitle) ? -1 : 1);
  }
}

const getFilterFn = (filterOptions: FilterOptions) => (album: Album) => {
  const { text, column, interval } = filterOptions;

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

interface LinkListProps {
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
  filterOptions: FilterOptions;
}

const AlbumTable = ({ albums, playingAlbum, setPlayingAlbum, filterOptions } : LinkListProps) => {
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);

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
    .filter(getFilterFn(filterOptions))
    .toSorted(getSortFn(sortColumn, sortOrder));

  return (
    <table className='album-table'>
      <thead>
        <tr>
          <SortableColumn 
            value={AlbumColumn.ARTIST}
            setValue={handleSortChange}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
          />
          <SortableColumn 
            value={AlbumColumn.ALBUM}
            setValue={handleSortChange}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
          />
          <th>Year</th>
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

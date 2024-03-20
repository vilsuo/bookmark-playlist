import { useState } from 'react';
import { Album, AlbumColumn } from '../../types';
import AlbumRow from './AlbumRow';
import ExtraRow from './ExtraRow';
import { FilterOptions } from './AlbumFilter';

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
      return (album.artist.toLowerCase().search(searchText) !== -1);
    } else {
      return (album.title.toLowerCase().search(searchText) !== -1);
    }
  } else {
    const { published } = album;
    const { start, end } = interval;

    if (!start && !end) {
      return 1;
    } else if (start && end) {
      return published >= Number(start) && published <= Number(end);
    } else if (start) {
      return published >= Number(start);
    } else {
      return published <= Number(end);
    }
  }
};

enum Order {
  DESC = -1, // largest to smallest
  ASC = 1,  // smallest to largest
}

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

  const getSortClassName = (colum: AlbumColumn) => {
    if (sortColumn === colum) {
      return sortOrder === Order.ASC ? 'asc' : 'desc';
    }
    return undefined;
  };

  const sortedAlbums = albums
    .filter(getFilterFn(filterOptions))
    .toSorted(getSortFn(sortColumn, sortOrder));

  return (
    <table className='album-table'>
      <thead>
        <tr>
          <th className='sortable'
            onClick={() => handleSortChange(AlbumColumn.ARTIST)}
          >
            Artist
            <div className={`sortable-icon ${getSortClassName(AlbumColumn.ARTIST)}`}></div>
          </th>
          <th className='sortable'
            onClick={() => handleSortChange(AlbumColumn.ALBUM)}
          >
            Title
            <div className={`sortable-icon ${getSortClassName(AlbumColumn.ALBUM)}`}></div>
          </th>
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

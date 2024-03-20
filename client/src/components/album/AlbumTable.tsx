import { useState } from 'react';
import { Album, AlbumColumn } from '../../types';
import AlbumRow from './AlbumRow';
import ExtraRow from './ExtraRow';

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

const getFilterFn = (filter: string) => (album: Album) => {
  if (!filter) return true;

  return (album.artist.toLowerCase().search(filter) !== -1)
   || (album.title.toLowerCase().search(filter) !== -1);
};

enum Order {
  DESC = -1, // largest to smallest
  ASC = 1,  // smallest to largest
}

interface LinkListProps {
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;

  filter: string;
}

const AlbumTable = ({ albums, playingAlbum, setPlayingAlbum, filter } : LinkListProps) => {
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);

  const [sortColumn, setSortColumn] = useState<AlbumColumn>(AlbumColumn.ARTIST);
  const [sortOrder, setSortOrder] = useState<Order>(Order.ASC);

  const isPlaying = (album: Album) => {
    return playingAlbum !== null && playingAlbum.videoId === album.videoId;
  };

  const isViewed = (album: Album) => {
    return viewingAlbum !== null && viewingAlbum.videoId === album.videoId;
  };

  const handleSort = (colum: AlbumColumn) => {
    if (colum === sortColumn) {
      setSortOrder(sortOrder === Order.ASC ? Order.DESC : Order.ASC);
    }

    setSortColumn(colum);
  };

  const sortedAlbums = albums
    .filter(getFilterFn(filter))
    .toSorted(getSortFn(sortColumn, sortOrder));

  const getSortIcon = (colum: AlbumColumn) => {
    if (sortColumn === colum) {
      return sortOrder === Order.ASC ? 'asc' : 'desc';
    }
    return undefined;
  };

  return (
    <table className='album-table'>
      <thead>
        <tr>
          <th className='sortable'
            onClick={() => handleSort(AlbumColumn.ARTIST)}
          >
            Artist
            <div className={`sortable-icon ${getSortIcon(AlbumColumn.ARTIST)}`}></div>
          </th>
          <th className='sortable'
            onClick={() => handleSort(AlbumColumn.ALBUM)}
          >
            Title
            <div className={`sortable-icon ${getSortIcon(AlbumColumn.ALBUM)}`}></div>
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

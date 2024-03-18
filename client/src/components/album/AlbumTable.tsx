import { useState } from 'react';
import { Album } from '../../types';
import AlbumRow from './AlbumRow';
import ExtraRow from './ExtraRow';

enum Order {
  DESC = -1, // largest to smallest
  ASC = 1,  // smallest to largest
}

enum Column {
  ARTIST,
  ALBUM,
}

interface LinkListProps {
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
}

const AlbumTable = ({ albums, playingAlbum, setPlayingAlbum } : LinkListProps) => {
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);

  const [sortColumn, setSortColumn] = useState<Column>(Column.ARTIST);
  const [sortOrder, setSortOrder] = useState<Order>(Order.ASC);

  const isPlaying = (album: Album) => {
    return playingAlbum !== null && playingAlbum.videoId === album.videoId;
  };

  const isViewed = (album: Album) => {
    return viewingAlbum !== null && viewingAlbum.videoId === album.videoId;
  };

  const handleSort = (colum: Column) => {
    if (colum === sortColumn) {
      setSortOrder(sortOrder === Order.ASC ? Order.DESC : Order.ASC);
    }

    setSortColumn(colum);
  };

  const sortedAlbums = albums.toSorted((a: Album, b: Album) => {
    const aArtist = a.artist.toLowerCase();
    const bArtist = b.artist.toLowerCase();

    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();

    if (sortColumn === Column.ARTIST) {
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
  });

  const getSortIcon = (colum: Column) => {
    if (sortColumn === colum) {
      return sortOrder === Order.ASC ? 'asc' : 'desc';
    }
    return undefined;
  };

  return (
    <div>
      <h2>Albums</h2>

      <p>Column { sortColumn === Column.ARTIST ? 'artist' : 'album' }</p>
      <p>Order { sortOrder === Order.ASC ? 'asc' : 'desc' }</p>
      
      <table className='album-table'>
        <thead>
          <tr>
            <th className='sortable'
              onClick={() => handleSort(Column.ARTIST)}
            >
              Artist
              <div className={`sortable-icon ${getSortIcon(Column.ARTIST)}`}></div>
            </th>
            <th className='sortable'
              onClick={() => handleSort(Column.ALBUM)}
            >
              Album
              <div className={`sortable-icon ${getSortIcon(Column.ALBUM)}`}></div>
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
    </div>
  );
};

export default AlbumTable;

import { useState } from 'react';
import { Album } from '../../types';
import AlbumRow from './AlbumRow';
import ExtraRow from './ExtraRow';

interface LinkListProps {
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
}

const AlbumTable = ({ albums, playingAlbum, setPlayingAlbum } : LinkListProps) => {
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);

  const isPlaying = (album: Album) => {
    return playingAlbum !== null && playingAlbum.videoId === album.videoId;
  };

  const isViewed = (album: Album) => {
    return viewingAlbum !== null && viewingAlbum.videoId === album.videoId;
  };

  return (
    <div>
      <h2>Albums</h2>
      
      <table className='album-table'>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Album</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) =>
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

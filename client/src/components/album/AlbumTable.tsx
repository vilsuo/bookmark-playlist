import { Album } from '../../types';
import AlbumRow from './AlbumRow';

interface LinkListProps {
  albums: Album[];
  currentAlbum: Album | null;
  setCurrentAlbum: (album: Album | null) => void;
}

const AlbumTable = ({ albums, currentAlbum, setCurrentAlbum } : LinkListProps) => {
  const handleSelect = (album: Album | null) => {
    setCurrentAlbum(album);
  };

  const isCurrentAlbum = (album: Album) => {
    return !!currentAlbum && currentAlbum.videoId === album.videoId;
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
            <AlbumRow
              key={album.videoId}
              album={album}
              isSelected={isCurrentAlbum(album)}
              select={handleSelect}
            />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlbumTable;

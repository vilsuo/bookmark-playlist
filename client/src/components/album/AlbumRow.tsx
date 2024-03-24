import { Album } from '../../types';

interface AlbumRowProps {
  album: Album;
  isPlaying: boolean;
  setViewingAlbum: (album: Album) => void;
}

const AlbumRow = ({ album, isPlaying, setViewingAlbum }: AlbumRowProps) => {
  return (
    <tr
      className={`album-row ${isPlaying ? 'playing' : ''}`}
      onClick={() => setViewingAlbum(album)}
    >
      <td>{album.artist}</td>
      <td>{album.title}</td>
      <td>{album.published}</td>
    </tr>
  );
};

export default AlbumRow;

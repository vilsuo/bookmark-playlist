import { Album } from '../../types';

interface AlbumRowProps {
  album: Album;
  isPlaying: boolean;
  isViewing: boolean;
  view: (album: Album | null) => void;
}

const AlbumRow = ({ album, isPlaying, isViewing, view }: AlbumRowProps) => {

  // class names
  const playing = isPlaying ? 'playing' : '';
  const viewing = isViewing ? 'viewing': '';

  const toggleView = () => {
    isViewing ? view(null) : view(album);
  };

  return (
    <tr
      className={`album-row ${playing} ${viewing}`}
      onClick={toggleView}
    >
      <td>{album.artist}</td>
      <td>{album.title}</td>
      <td>{album.published}</td>
    </tr>
  );
};

export default AlbumRow;

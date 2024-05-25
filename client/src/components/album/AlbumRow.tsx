import { Album } from '../../types';
import { toDateString } from '../../util/dateConverter';

const getExtraClassNames = (isPlayed: boolean, isViewed: boolean) => {
  const playing = isPlayed ? 'playing' : '';
  const viewing = isViewed ? 'viewing': '';
  return `${playing} ${viewing}`;
};

interface AlbumRowProps {
  album: Album;
  isPlayed: boolean;
  isViewed: boolean;
  view: (album: Album | null) => void;
}

const AlbumRow = ({ album, isPlayed, isViewed, view }: AlbumRowProps) => {
  
  const toggleView = () => {
    isViewed ? view(null) : view(album);
  };

  return (
    <tr
      className={`album-row ${getExtraClassNames(isPlayed, isViewed)}`}
      onClick={toggleView}
    >
      <td>{album.artist}</td>
      <td>{album.title}</td>
      <td>{album.published}</td>
      <td>{toDateString(album.addDate)}</td>
    </tr>
  );
};

export default AlbumRow;

import { Album } from '../../types';

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

  const parseAddDate = (album: Album) => album.addDate.split('T')[0].replace(/-/g, '/');

  return (
    <tr
      className={`album-row ${getExtraClassNames(isPlayed, isViewed)}`}
      onClick={toggleView}
    >
      <td>{album.artist}</td>
      <td>{album.title}</td>
      <td>{album.published}</td>
      <td>{parseAddDate(album)}</td>
    </tr>
  );
};

export default AlbumRow;

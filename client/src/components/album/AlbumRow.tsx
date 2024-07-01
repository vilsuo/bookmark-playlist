import { useAppSelector } from '../../redux/hooks';
import { selectIsPlaying } from '../../redux/reducers/albumsSlice';
import { Album } from '../../types';
import { toDateString } from '../../util/dateConverter';

const getExtraClassNames = (isPlaying: boolean, isViewed: boolean) => {
  const playing = isPlaying ? 'playing' : '';
  const viewing = isViewed ? 'viewing': '';
  return `${playing} ${viewing}`;
};

interface AlbumRowProps {
  album: Album;
  isViewed: boolean;
  view: (album: Album | null) => void;
}

const AlbumRow = ({ album, isViewed, view }: AlbumRowProps) => {

  const isPlaying = useAppSelector(state => selectIsPlaying(state, album));
  
  const toggleView = () => {
    isViewed ? view(null) : view(album);
  };

  return (
    <tr
      className={`album-row ${getExtraClassNames(isPlaying, isViewed)}`}
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

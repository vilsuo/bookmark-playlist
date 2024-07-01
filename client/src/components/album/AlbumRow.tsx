import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectIsPlaying, selectIsViewing, setViewingAlbum } from '../../redux/reducers/albumsSlice';
import { Album } from '../../types';
import { toDateString } from '../../util/dateConverter';

const getExtraClassNames = (isPlaying: boolean, isViewing: boolean) => {
  const playing = isPlaying ? 'playing' : '';
  const viewing = isViewing ? 'viewing': '';
  return `${playing} ${viewing}`;
};

interface AlbumRowProps {
  album: Album;
}

const AlbumRow = ({ album }: AlbumRowProps) => {
  const isPlaying = useAppSelector(state => selectIsPlaying(state, album));
  const isViewing = useAppSelector(state => selectIsViewing(state, album));

  const dispatch = useAppDispatch();
  
  const toggleView = () => {
    isViewing ? dispatch(setViewingAlbum(null)) : dispatch(setViewingAlbum(album));
  };

  return (
    <tr
      className={`album-row ${getExtraClassNames(isPlaying, isViewing)}`}
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

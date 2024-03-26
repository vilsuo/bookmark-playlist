import { useAppDispatch } from '../../../redux/hooks';
import { Album } from '../../../types';
import { queueAdd } from '../../../redux/reducers/albumsSlice';

interface AlbumsViewProps {
  album: Album;
  close: () => void;
  play: () => void;
}

const AlbumsView = ({ album, close, play }: AlbumsViewProps) => {
  const dispatch = useAppDispatch();
  const addToQueue = () => dispatch(queueAdd(album));

  return (
    <div className="albums-view">
      <div className="header">
        <h3>Selected Album</h3>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className="content">
        <div className="actions">
          <button onClick={play}>Play</button>
          <button onClick={addToQueue}>Queue</button>
        </div>
        <div className="details">
          <span className="artist">{album.artist}</span>
          <span className="title">{album.title}</span>
        </div>
      </div>
    </div>
  );
};

export default AlbumsView;

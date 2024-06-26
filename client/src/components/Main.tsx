import { useAppSelector } from '../redux/hooks';
import { selectPlaying } from '../redux/reducers/albumsSlice';
import QueueTable from './queue/QueueTable';
import VideoContainer from './video/VideoContainer';

const Main = () => {
  const playingAlbum = useAppSelector(selectPlaying);

  return (
    <div className="main">
      {playingAlbum && (
        <VideoContainer playingAlbum={playingAlbum} />
      )}

      <div>
        <QueueTable />
      </div>
    </div>
  );
};

export default Main;

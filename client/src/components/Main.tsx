import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { play, selectPlaying } from '../redux/reducers/albumsSlice';
import QueueTable from './queue/QueueTable';
import VideoContainer from './video/VideoContainer';

const Main = () => {
  const dispatch = useAppDispatch();

  const playingAlbum = useAppSelector(selectPlaying);

  const closeVideo = () => { dispatch(play(null)); };

  return (
    <div className="main">
      {playingAlbum && (
        <VideoContainer
          playingAlbum={playingAlbum}
          closeVideo={closeVideo}
        />
      )}

      <div>
        <QueueTable />
      </div>
    </div>
  );
};

export default Main;

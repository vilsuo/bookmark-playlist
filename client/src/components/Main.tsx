import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { play, selectPlaying } from '../redux/reducers/albumsSlice';
import { queuePop, selectQueueFirst } from '../redux/reducers/queueSlice';
import QueueTable from './queue/QueueTable';
import VideoPlayer from './video/VideoPlayer';

const Main = () => {
  const dispatch = useAppDispatch();
  const playingAlbum = useAppSelector(selectPlaying);
  const nextAlbumInQueue = useAppSelector(selectQueueFirst);

  const closeVideo = () => {
    dispatch(play(nextAlbumInQueue));
    dispatch(queuePop());
  };

  return (
    <div className="main">
      {playingAlbum && (
        <VideoPlayer album={playingAlbum} closeVideo={closeVideo} />
      )}

      <div>
        <QueueTable />
      </div>
    </div>
  );
};

export default Main;

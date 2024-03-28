import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { play, selectPlaying } from '../redux/reducers/albumsSlice';
import { queuePop, selectQueueFirst } from '../redux/reducers/queueSlice';
import QueueTable from './queue/QueueTable';
import VideoContainer from './video/VideoContainer';

const Main = () => {
  const dispatch = useAppDispatch();
  const playingAlbum = useAppSelector(selectPlaying);
  const nextAlbumInQueue = useAppSelector(selectQueueFirst);

  const playNextFromQueue = () => {
    dispatch(play(nextAlbumInQueue));
    dispatch(queuePop());
  };

  return (
    <div className="main">
      {playingAlbum && (
        <VideoContainer album={playingAlbum} closeVideo={playNextFromQueue} playNext={playNextFromQueue} />
      )}

      <div>
        <QueueTable />
      </div>
    </div>
  );
};

export default Main;

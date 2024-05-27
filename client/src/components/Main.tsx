import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { play, selectPlaying } from '../redux/reducers/albumsSlice';
import { queuePop, selectPlayMode, selectQueueFirst } from '../redux/reducers/queueSlice';
import { Album, PlayMode } from '../types';
import QueueTable from './queue/QueueTable';
import VideoContainer from './video/VideoContainer';

interface MainProps {
  albums: Album[];
}

const Main = ({ albums }: MainProps) => {
  const dispatch = useAppDispatch();
  const playMode = useAppSelector(selectPlayMode);
  const playingAlbum = useAppSelector(selectPlaying);
  const nextAlbumInQueue = useAppSelector(selectQueueFirst);

  const closeVideo = () => {
    dispatch(play(null));
  };

  const getNextAlbumInSequence = () => {
    // no albums and/or match the filter
    if (!albums.length) { return null; }

    // no album selected, play the first
    if (!playingAlbum) { return albums[0]; }

    const playingAlbumIdx = albums.findIndex((album) => album.id === playingAlbum.id);
    if (playingAlbumIdx === -1) {
      // album not found, user likely changed filters...
      return albums[0];

    } else if (playingAlbumIdx === albums.length - 1) {
      // reached the end of the list
      return null;

    } else {
      // return next in sequence
      return albums[playingAlbumIdx + 1];
    }
  };

  // can return the current playing album...
  const getRandomAlbum = () => albums.length ? albums[Math.floor(albums.length * Math.random())] : null;

  const playNext = () => {
    if (nextAlbumInQueue) {
      // always prioritize queue

      // in sequential mode, sequence starts again from the queued album...
      dispatch(play(nextAlbumInQueue));
      dispatch(queuePop());

    } else {
      // no albums are queued
      switch (playMode) {
        case PlayMode.MANUAL: {
          closeVideo();
          break;
        }
        case PlayMode.SEQUENCE: {
          dispatch(play(getNextAlbumInSequence()));
          break;
        }
        case PlayMode.SHUFFLE: {
          dispatch(play(getRandomAlbum()));
          break;
        }
        default:
          playMode satisfies never;
      }
    }
  };

  return (
    <div className="main">
      {playingAlbum && (
        <VideoContainer
          album={playingAlbum}
          closeVideo={closeVideo}
          playNext={playNext} />
      )}

      <div>
        <QueueTable />
      </div>
    </div>
  );
};

export default Main;

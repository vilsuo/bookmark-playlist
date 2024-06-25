import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { play, selectPlaying } from '../redux/reducers/albumsSlice';
import { queuePop, selectQueueFirst } from '../redux/reducers/queueSlice';
import { selectPlayMode } from '../redux/reducers/settingsSlice';
import { Album, PlayMode } from '../types';
import { getNextAlbumInSequence, getRandomAlbum } from '../util/albumHelpers';
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

  /**
   * Notice: in {@link PlayMode.SEQUENCE}, sequence starts again from the queued album
   */
  const playNext = () => {
    if (nextAlbumInQueue) {
      // always prioritize queue
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
          dispatch(play(getNextAlbumInSequence(albums, playingAlbum)));
          break;
        }
        case PlayMode.SHUFFLE: {
          dispatch(play(getRandomAlbum(albums)));
          break;
        }
        default:
          playMode satisfies never;
      }
    }
  };

  /**
   * Check if next album can be played based on current {@link PlayMode}
   * @returns
   */
  const checkDisableNext = () => {
    // can play next from queue
    if (nextAlbumInQueue !== null) { return false; }

    switch (playMode) {
      case PlayMode.MANUAL: {
        // can only play from queue
        return true;
      }
      case PlayMode.SEQUENCE: {
        // no sequence to play
        if (albums.length === 0) { return true; }

        return playingAlbum
          ? (albums[albums.length - 1].id === playingAlbum.id) // playing last album in sequence
          : false;
      }
      case PlayMode.SHUFFLE: {
        // disable if album list is empty
        return (albums.length === 0);
      }
      default:
        playMode satisfies never;
        return true;
    }
  }

  return (
    <div className="main">
      {playingAlbum && (
        <VideoContainer
          album={playingAlbum}
          closeVideo={closeVideo}
          playNext={playNext}
          disablePlayingNext={checkDisableNext()}
        />
      )}

      <div>
        <QueueTable />
      </div>
    </div>
  );
};

export default Main;

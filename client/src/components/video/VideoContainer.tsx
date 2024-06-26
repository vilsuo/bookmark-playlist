import { Album } from '../../types';
import VideoPlayer from './VideoPlayer';
import VideoDetails from './VideoDetails';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectPlayMode, selectShowVideoDetails } from '../../redux/reducers/settingsSlice';
import { play, selectSortedAndFilteredAlbums } from '../../redux/reducers/albumsSlice';
import { queuePop, selectQueueFirst } from '../../redux/reducers/queueSlice';
import { getNextPlayingAlbum } from '../../util/albumHelpers';

const formatVideoTitle = (album: Album) => {
  const { artist, title, published } = album;
  return `${artist} - ${title} (${published})`;
};

interface VideoContainerProps {
  playingAlbum: Album;
  closeVideo: () => void;
}

const VideoContainer = ({ playingAlbum, closeVideo }: VideoContainerProps) => {
  const dispatch = useAppDispatch();

  const showVideoDetails = useAppSelector(selectShowVideoDetails);

  const albums = useAppSelector(selectSortedAndFilteredAlbums);
  const nextAlbumInQueue = useAppSelector(selectQueueFirst);
  const playMode = useAppSelector(selectPlayMode);

  const playNext = () => {
    const { album, queue } = getNextPlayingAlbum(
      albums, nextAlbumInQueue, playMode, playingAlbum
    );

    if (!album) {
      closeVideo();
    } else {
      if (queue) { dispatch(queuePop()); }
      dispatch(play(album));
    }
    
    //const rand = Math.random();
  };

  return (
    <div className="video-container">
      <div className="header">
        <h1>{formatVideoTitle(playingAlbum)}</h1>
      </div>

      <VideoPlayer
        videoId={playingAlbum.videoId}
        playNext={playNext}
        close={closeVideo}
      />

      { showVideoDetails && <VideoDetails album={playingAlbum} /> }
    </div>
  );
};

export default VideoContainer;

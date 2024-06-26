import { Album } from '../../types';
import VideoPlayer from './VideoPlayer';
import VideoDetails from './VideoDetails';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShowVideoDetails } from '../../redux/reducers/settingsSlice';
import { play, playNext } from '../../redux/reducers/albumsSlice';

const formatVideoTitle = (album: Album) => {
  const { artist, title, published } = album;
  return `${artist} - ${title} (${published})`;
};

interface VideoContainerProps {
  playingAlbum: Album;
}

const VideoContainer = ({ playingAlbum }: VideoContainerProps) => {
  const dispatch = useAppDispatch();

  const showVideoDetails = useAppSelector(selectShowVideoDetails);

  return (
    <div className="video-container">
      <div className="header">
        <h1>{formatVideoTitle(playingAlbum)}</h1>
      </div>

      <VideoPlayer
        videoId={playingAlbum.videoId}
        playNext={() => { dispatch(playNext()); }}
        close={() => { dispatch(play(null)); } }
      />

      { showVideoDetails && <VideoDetails album={playingAlbum} /> }
    </div>
  );
};

export default VideoContainer;

import { Album } from '../../types';
import VideoPlayer from './VideoPlayer';
import VideoDetails from './VideoDetails';
import { useAppSelector } from '../../redux/hooks';
import { selectShowVideoDetails } from '../../redux/reducers/settingsSlice';

const formatVideoTitle = (album: Album) => {
  const { artist, title, published } = album;
  return `${artist} - ${title} (${published})`;
};

interface VideoContainerProps {
  album: Album;
  closeVideo: () => void;
  playNext: () => void;
  disablePlayingNext: boolean;
}

const VideoContainer = ({ album, closeVideo, playNext, disablePlayingNext }: VideoContainerProps) => {
  const showVideoDetails = useAppSelector(selectShowVideoDetails);

  return (
    <div className="video-container">
      <div className="header">
        <h1>{formatVideoTitle(album)}</h1>
      </div>

      <VideoPlayer
        videoId={album.videoId}
        playNext={playNext}
        close={closeVideo}
        disablePlayingNext={disablePlayingNext}
      />

      { showVideoDetails && <VideoDetails album={album} /> }
    </div>
  );
};

export default VideoContainer;

import { Album } from '../../types';
import Video from './Video';
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
}

const VideoContainer = ({ album, closeVideo, playNext }: VideoContainerProps) => {
  const showVideoDetails = useAppSelector(selectShowVideoDetails);

  return (
    <div className="video-container">
      <div className="header">
        <h1>{formatVideoTitle(album)}</h1>
        <button onClick={closeVideo}>&#x2715;</button>
      </div>

      <Video videoId={album.videoId} playNext={playNext} />

      { showVideoDetails && <VideoDetails album={album} /> }
    </div>
  );
};

export default VideoContainer;

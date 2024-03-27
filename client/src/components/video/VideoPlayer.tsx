import { Album } from '../../types';
import Video from './Video';
import VideoDetails from './VideoDetails';

const formatVideoTitle = (album: Album) => {
  const { artist, title, published } = album;
  return `${artist} - ${title} (${published})`;
};

interface VideoPlayerProps {
  album: Album;
  closeVideo: () => void;
  playNext: () => void;
}

const VideoPlayer = ({ album, closeVideo, playNext }: VideoPlayerProps) => {
  return (
    <div className="video-player">
      <div className="header">
        <h1>{formatVideoTitle(album)}</h1>
        <button onClick={closeVideo}>&#x2715;</button>
      </div>

      <Video videoId={album.videoId} playNext={playNext} />

      <VideoDetails album={album} />
    </div>
  );
};

export default VideoPlayer;

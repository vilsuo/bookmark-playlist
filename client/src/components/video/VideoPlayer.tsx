import { Album } from '../../types';
import Video from './Video';

const formatVideoTitle = (album: Album) => {
  const { artist, title, published } = album;

  return `${artist} - ${title} (${published})`;
};

interface VideoPlayerProps {
  playingAlbum: Album;
  closeVideo: () => void;
}

const VideoPlayer = ({ playingAlbum, closeVideo }: VideoPlayerProps) => {
  return (
    <div className="video-player">
      <div className="header">
        <h1>{formatVideoTitle(playingAlbum)}</h1>
        <button onClick={closeVideo}>&#x2715;</button>
      </div>

      <Video videoId={playingAlbum.videoId} />
    </div>
  );
};

export default VideoPlayer;

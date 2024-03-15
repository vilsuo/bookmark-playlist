import YouTube, { YouTubeProps } from 'react-youtube';
import { Link } from '../types';

interface VideoProps {
  link: Link;
}

const VIDEO_ID_LENGTH = 11;

const Video = ({ link }: VideoProps) => {
  const videoId = link.href.split('?v=')[1].substring(0, VIDEO_ID_LENGTH);
  
  const options = {
    width: '945',
    height: '540',
  
    // https://developers.google.com/youtube/player_parameters
    playerVars: {
      // This parameter indicates whether the video player controls are displayed
      // 1 – Player controls display in the player.
      controls: 1,
    },
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  console.log('videoId', videoId);

  return (
    <YouTube
      videoId={videoId}
      opts={options}
      onReady={onPlayerReady}
      id='video'
    />
  );
};

export default Video;

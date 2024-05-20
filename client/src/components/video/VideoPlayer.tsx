import { useAppSelector } from '../../redux/hooks';
import { selectAutoplay, selectAutoqueue } from '../../redux/reducers/settingsSlice';
import YouTube, { YouTubeProps } from 'react-youtube';
import VideoControls from './VideoControls';
import { useRef, useState } from 'react';
import { SKIP_SECONDS } from '../../constants';

enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  VIDEO_CUED = 5,
};

const ORIGIN = 'http://localhost:5173';

/**
 * https://developers.google.com/youtube/player_parameters
 */
const BASE_PLAYER_VARS = {
  // autoplay
  // cc_lang_pref
  // cc_load_policy
  // color
  // controls
  // disablekb
  
  // enables the player to be controlled via IFrame Player API calls
  enablejsapi: 1,

  // end
  
  // prevent the fullscreen button from displaying in the player
  fs: 0,

  // hl
  // iv_load_policy
  // list
  // listType
  // loop
  // modestbranding
  
  // This parameter provides an extra security measure for the IFrame API and
  // is only supported for IFrame embeds. If you are using the IFrame API, which
  // means you are setting the enablejsapi parameter value to 1, you should always
  // specify your domain as the origin parameter value.
  origin, ORIGIN,

  // playlist
  // playsinline
  // rel
  // start
  // widget_referrer
};

interface VideoPlayerProps {
  videoId: string;
  playNext: () => void;
  close: () => void;
}

const VideoPlayer = ({ videoId, playNext, close }: VideoPlayerProps) => {
  const autoPlay = useAppSelector(selectAutoplay);
  const autoqueue = useAppSelector(selectAutoqueue);

  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef<YouTube>(null);

  const opts: YouTubeProps['opts'] = {
    // width
    // height
    // videoId
    playerVars: {
      ...BASE_PLAYER_VARS,

      autoplay: +autoPlay,
      loop: 0,
    },
    // events,
  };

  /**
   * This event fires when the layer's state changes to PlayerState.ENDED.
   * 
   * @param event 
   */
  const onEnd: YouTubeProps['onEnd'] = () => {
    if (autoqueue) { playNext(); }
  };

  /**
   * This event fires if an error occurs in the player.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onError}
   * 
   * @param event 
   */
  const onError: YouTubeProps['onError'] = (event) => {
    console.log('YouTube.onError');
  };

  /**
   * This event fires whenever the player's state changes.
   * 
   * @param event The data property will specify an integer that corresponds
   *              to the new player state
   */
  const onStateChange: YouTubeProps['onStateChange'] = async (event) => {
    const currentState = event.data;
    setIsPlaying(currentState === PlayerState.PLAYING);
  };

  const getPlayer = () => {
    const target = ref.current;
    return (target !== null) ? target.internalPlayer : null;
  };

  const getTime = async () => {
    const player = getPlayer();
    return player ? await player.getCurrentTime() : 0;
  };

  const getDuration = async () => {
    const player = getPlayer();
    return player ? await player.getDuration() : 0;
  };

  const seekTo = async (cb: (current: number) => number) => {
    const player = getPlayer();
    if (player) {
      const currentTime = await getTime();
      await player.seekTo(cb(currentTime));
    }
  };

  const forward = async () => seekTo((current) => current + SKIP_SECONDS);
  const backward = async () => seekTo((current) => Math.max(current - SKIP_SECONDS, 0));

  const togglePlay = async () => {
    const player = getPlayer();
    if (player) {
      const currentState = await player.getPlayerState();
      if (currentState === PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  return (
    <div>
      <div className="video">
        <YouTube
          ref={ref}
          videoId={videoId}
          opts={opts}
          onEnd={onEnd}
          onError={onError}
          onStateChange={onStateChange}
        />
      </div>
      
      <VideoControls
        key={`controls-${videoId}`}
        close={close}
        toggle={togglePlay}
        forward={forward}
        backward={backward}
        isPlaying={isPlaying}
        getTime={getTime}
        getDuration={getDuration}
      />
    </div>
  );
};

export default VideoPlayer;

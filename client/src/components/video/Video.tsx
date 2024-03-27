import { useAppSelector } from '../../redux/hooks';
import { selectAutoplay } from '../../redux/reducers/settingsSlice';
import YouTube, { YouTubeProps } from 'react-youtube';

enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAYSED = 2,
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

interface VideoProps {
  videoId: string;
}

const Video = ({ videoId }: VideoProps) => {
  const autoPlay = useAppSelector(selectAutoplay);

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
   * This event fires whenever a player has finished loading and is ready
   * to begin receiving API calls.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onReady}
   * 
   * @param event 
   */
  const onReady: YouTubeProps['onReady'] = (event) => {
    console.log('Ready');
  };

  /**
   * This event fires if an error occurs in the player.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onError}
   * 
   * @param event 
   */
  const onError: YouTube['onError'] = (event) => {
    console.log('Error');
  };

  /**
   * This event fires when the layer's state changes to PlayerState.PLAYING.
   * 
   * @param event 
   */
  const onPlay: YouTubeProps['onPlay'] = (event) => {
  };

  /**
   * This event fires when the layer's state changes to PlayerState.PAUSED.
   * 
   * @param event 
   */
  const onPause: YouTubeProps['onPause'] = (event) => {
  };

  /**
   * This event fires when the layer's state changes to PlayerState.ENDED.
   * 
   * @param event 
   */
  const onEnd: YouTubeProps['onEnd'] = (event) => {
    console.log('End');
  };

  /**
   * This event fires whenever the player's state changes.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onStateChange}
   * 
   * @param event 
   */
  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
  };

  return (
    <div className="video">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onError={onError}
        onEnd={onEnd}
      />
    </div>
  );
};

export default Video;

import { useAppSelector } from '../../redux/hooks';
import { selectAutoplay, selectAutoqueue } from '../../redux/reducers/settingsSlice';
import YouTube, { YouTubeProps } from 'react-youtube';

/*
enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAYSED = 2,
  BUFFERING = 3,
  VIDEO_CUED = 5,
};
*/

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
  playNext: () => void;
}

const Video = ({ videoId, playNext }: VideoProps) => {
  const autoPlay = useAppSelector(selectAutoplay);
  const autoqueue = useAppSelector(selectAutoqueue);

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
   * This event fires if an error occurs in the player.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onError}
   * 
   * @param event 
   */
  const onError: YouTubeProps['onError'] = (event) => {
    console.log('YouTube.onError');
  };

  /**
   * This event fires when the layer's state changes to PlayerState.ENDED.
   * 
   * @param event 
   */
  const onEnd: YouTubeProps['onEnd'] = (event) => {
    if (autoqueue) {
      playNext();
    }
  };

  return (
    <div className="video">
      <YouTube
        videoId={videoId}
        opts={opts}
        onEnd={onEnd}
        onError={onError}
      />
    </div>
  );
};

export default Video;

import { useAppSelector } from '../../redux/hooks';
import { selectAutoplay } from '../../redux/reducers/settingsSlice';
import { getYoutubeEmbedLink } from '../../util/links';

interface VideoProps {
  videoId: string;
}

const ORIGIN = 'http://localhost:5173';

const BASE_ATTRIBUTES = {
  // enables the player to be controlled via IFrame Player API calls
  enablejsapi: 1,

  // prevent the fullscreen button from displaying in the player
  fs: 0,

  // This parameter provides an extra security measure for the IFrame API and
  // is only supported for IFrame embeds. If you are using the IFrame API, which
  // means you are setting the enablejsapi parameter value to 1, you should always
  // specify your domain as the origin parameter value.
  origin, ORIGIN,
};

const Video = ({ videoId }: VideoProps) => {
  const autoPlay = useAppSelector(selectAutoplay);

  const attributes = {
    ...BASE_ATTRIBUTES,

    autoplay: +autoPlay,

    loop: 0,

    /*
    This parameter specifies a comma-separated list of video IDs to play.
    If you specify a value, the first video that plays will be the VIDEO_ID
    specified in the URL path, and the videos specified in the playlist
    parameter will play thereafter. ???

    playlist
    */
  };

  return (
    <div className="video">
      <iframe
        src={getYoutubeEmbedLink(videoId, attributes)}
      />
    </div>
  );
};

export default Video;

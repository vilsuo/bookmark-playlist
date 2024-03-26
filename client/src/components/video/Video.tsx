import { useAppSelector } from '../../redux/hooks';
import { selectAutoplay } from '../../redux/reducers/settingsSlice';

interface VideoProps {
  videoId: string;
}

/*
type Attribute = {
  key: string;
  value: string | number | boolean;
};

const getQuery = (attributes: Attribute[]) => attributes.map(
  (attribute) => `${attribute.key}=${attribute.value}`
);
*/

const ORIGIN = 'http://localhost:5173';

const createAttributes = (attributes: Record<string, string | number | boolean>) => {
  return Object.keys(attributes)
    .map((attr) => `${attr}=${attributes[attr]}`)
    .join('&');
};

const Video = ({ videoId }: VideoProps) => {
  const autoPlay = useAppSelector(selectAutoplay);

  const attributes = {
    autoplay: +autoPlay,

    // enables the player to be controlled via IFrame Player API calls
    enablejsapi: 1,

    // prevent the fullscreen button from displaying in the player
    fs: 0,

    loop: 0,

    // This parameter provides an extra security measure for the IFrame API and
    // is only supported for IFrame embeds. If you are using the IFrame API, which
    // means you are setting the enablejsapi parameter value to 1, you should always
    // specify your domain as the origin parameter value.
    origin, ORIGIN,

    /*
    This parameter specifies a comma-separated list of video IDs to play.
    If you specify a value, the first video that plays will be the VIDEO_ID
    specified in the URL path, and the videos specified in the playlist
    parameter will play thereafter.

    playlist
    */
  };

  return (
    <div className="video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?${createAttributes(attributes)}`}
      />
    </div>
  );
};

export default Video;

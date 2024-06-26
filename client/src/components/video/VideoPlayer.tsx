import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAutoplay, selectAutoqueue } from '../../redux/reducers/settingsSlice';
import YouTube, { YouTubeProps } from 'react-youtube';
import VideoControls from './VideoControls';
import { useRef, useState } from 'react';
import { selectCanPlayNextAlbum } from '../../redux/reducers/albumsSlice';
import { BASE_PLAYER_VARS } from '../../constants';
import { addNotification } from '../../redux/reducers/notificationSlice';
import { NotificationType } from '../../types';
import { createYoutubeErrorMessage } from '../../util/errorMessages';

enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  VIDEO_CUED = 5,
};

interface VideoPlayerProps {
  videoId: string;
  playNext: () => void;
  close: () => void;
}

const VideoPlayer = ({ videoId, playNext, close }: VideoPlayerProps) => {
  // settings
  const autoPlay = useAppSelector(selectAutoplay);
  const autoqueue = useAppSelector(selectAutoqueue);

  const canPlayNext = useAppSelector(selectCanPlayNextAlbum);

  const dispatch = useAppDispatch();

  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef<YouTube>(null);

  const opts: YouTubeProps['opts'] = {
    playerVars: {
      ...BASE_PLAYER_VARS,
      autoplay: +autoPlay,
      loop: 0,
    },
  };

  /**
   * This event fires when the layer's state changes to PlayerState.ENDED.
   * 
   * @param event 
   */
  const onEnd: YouTubeProps['onEnd'] = () => {
    if (autoqueue && canPlayNext) { playNext(); }
  };

  /**
   * This event fires if an error occurs in the player.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onError}
   * 
   * @param event 
   */
  const onError: YouTubeProps['onError'] = (event) => {
    dispatch(addNotification({
      type: NotificationType.ERROR,
      title: "Youtube Error",
      message: createYoutubeErrorMessage(Number(event.data)),
    }));
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
    return (target !== null) ? target.getInternalPlayer() : null;
  };

  const getTime = async () => {
    const player = getPlayer();
    return player ? await player.getCurrentTime() : 0;
  };

  const getDuration = async () => {
    const player = getPlayer();
    return player ? await player.getDuration() : 0;
  };

  const seekTo = async (time: number) => {
    const player = getPlayer();
    if (player) {
      await player.seekTo(time);
    }
  };

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
    <div key={`controls-${videoId}`}>
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
        close={close}
        toggle={togglePlay}
        seekTo={seekTo}
        isPlaying={isPlaying}
        playNext={playNext}
        getTime={getTime}
        getDuration={getDuration}
        disablePlayingNext={!canPlayNext}
      />
    </div>
  );
};

export default VideoPlayer;

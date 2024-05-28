import { useEffect, useState } from 'react';
import { SKIP_SECONDS } from '../../constants';
import { useAppSelector } from '../../redux/hooks';
import { selectPlayMode } from '../../redux/reducers/settingsSlice';

const StopIcon = ({ size = 1}) => {
  const dim = 2 * 20 * size;

  return (
    <svg width={dim} height={dim} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" height="24" width="24" rx="2" />
    </svg>
  );
};

const ForwardIcon = ({ size = 1 }) => {
  const dim = 2 * 20 * size;

  return (
    <svg width={dim} height={dim} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,5 20,20 8,35" />
      <polygon points="21,5 33,20 21,35" />
    </svg>
  );
};

const BackwardIcon = ({ size = 1 }) => {
  const dim = 2 * 20 * size;

  return (
    <svg width={dim} height={dim} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,5 20,20 8,35" transform="scale(-1,1)" transform-origin="center" />
      <polygon points="21,5 33,20 21,35" transform="scale(-1,1)" transform-origin="center" />
    </svg>
  );
};

const PauseIcon = ({ size = 1 }) => {
  const dim = 2 * 20 * size;

  return (
    <svg width={dim} height={dim} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="5" height="30" width="8" rx="2" />
      <rect x="24" y="5" height="30" width="8" rx="2" />
    </svg>
  );
};

const PlayIcon = ({ size = 1 }) => {
  const dim = 2 * 20 * size;

  return (
    <svg width={dim} height={dim} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,5 32,20 8,35" />
    </svg>
  );
};

const SkipIcon = ({ size = 1}) => {
  const dim = 2 * 20 * size;

  return (
    <svg width={dim} height={dim} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,5 20,20 8,35" />
      <rect x="24" y="5" height="30" width="8" rx="2" />
    </svg>
  );
};

interface PlayToggleButtonProps {
  isPlaying: boolean;
  toggle: () => void;
}

const PlayToggleButton = ({ isPlaying, toggle }: PlayToggleButtonProps) => {

  const Icon = isPlaying ? <PauseIcon /> : <PlayIcon />;

  return (
    <button className="play-button" onClick={toggle}>
      { Icon }
    </button>
  );
};

const ProgressBar = ({ frac = 1 }) => {

  return (
    <svg viewBox="0 0 100 1" xmlns="http://www.w3.org/2000/svg">
      <rect height="1" width="100" fill="gray" /> 
      <rect height="1" width={frac * 100} fill="red" /> 
    </svg>
  );
};

interface VideoControlsProps {
  close: () => void;
  toggle: () => void;
  seekTo: (t: number) => Promise<void>;
  isPlaying: boolean;
  playNext: () => void;
  getTime: () => Promise<number>;
  getDuration: () => Promise<number>;
  disablePlayingNext: boolean;
}

const VideoControls = ({
  close,
  toggle,
  seekTo,
  isPlaying,
  playNext,
  getTime,
  getDuration,
  disablePlayingNext,
}: VideoControlsProps) => {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playMode = useAppSelector(selectPlayMode);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isPlaying) setTime(await getTime());
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, getTime]);

  useEffect(() => {
    getDuration()
      .then(res => setDuration(res))
      .catch(() => setDuration(0));
  }, [getDuration]);

  const formatTime = (totalTimeInSeconds: number) => {
    const hours = Math.floor(totalTimeInSeconds / 3600);
    const mins = Math.floor((totalTimeInSeconds - hours * 3600) / 60)
    const seconds = Math.floor(totalTimeInSeconds - hours * 3600 - mins * 60);

    const mm = (mins < 10) ? '0' + mins : mins;
    const ss = (seconds < 10) ? '0' + seconds : seconds;

    return hours ? (hours + ':' + mm + ':' + ss) : (mm + ':' + ss);
  };

  const handleForward = async () => {
    const currentTime = await getTime();
    const newTime = Math.min(currentTime + SKIP_SECONDS, duration);
    await seekTo(newTime);
    setTime(newTime);
  };

  const handleBackward = async () => {
    const currentTime = await getTime();
    const newTime = Math.max(0, currentTime - SKIP_SECONDS)
    await seekTo(newTime);
    setTime(newTime);
  };

  const fraction = (duration !== 0 && !isNaN(time / duration)) ? time / duration : 0;

  return (
    <div className="video-controls">
      <div className="actions">
        <button onClick={close}>
          <StopIcon size={0.75} />
        </button>

        <button onClick={handleBackward}>
          <BackwardIcon size={0.75} />
        </button>

        <PlayToggleButton isPlaying={isPlaying} toggle={toggle} />

        <button onClick={handleForward}>
          <ForwardIcon size={0.75} />
        </button>

        <button onClick={playNext} disabled={disablePlayingNext}>
          <SkipIcon size={0.75} />
        </button>
      </div>

      <div className="time">
        <ProgressBar frac={fraction} />
        <div className='details'>
          <div>{formatTime(time) + ' / ' + formatTime(duration)}</div>
          <div>{playMode}</div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;

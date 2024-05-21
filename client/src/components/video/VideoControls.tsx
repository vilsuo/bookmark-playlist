import { useEffect, useState } from 'react';
import { SKIP_SECONDS } from '../../constants';

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

interface VideoControlsProps {
  close: () => void;
  toggle: () => void;
  forward: () => Promise<void>;
  backward: () => Promise<void>;
  isPlaying: boolean;
  getTime: () => Promise<number>;
  getDuration: () => Promise<number>;
}

const VideoControls = ({
  close,
  toggle,
  forward,
  backward,
  isPlaying,
  getTime,
  getDuration,
}: VideoControlsProps) => {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    await forward();
    setTime(Math.min(time + SKIP_SECONDS, duration));
  };

  const handleBackward = async () => {
    await backward();
    setTime(Math.max(0, time - SKIP_SECONDS));
  };

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

        <button>
          <SkipIcon size={0.75} />
        </button>
      </div>

      {/*
      <div>
        <p>{formatTime(time) + ' / ' + formatTime(duration)}</p>
      </div>
      */}
    </div>
  );
};

export default VideoControls;

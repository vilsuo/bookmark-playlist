import { useEffect, useState } from 'react';
import { SKIP_SECONDS } from '../../constants';

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
      <button onClick={close}>Close</button>
      <button onClick={handleBackward}>{'-' + SKIP_SECONDS}</button>
      <button onClick={toggle}>{isPlaying ? 'Pause' : 'Resume'}</button>
      <button onClick={handleForward}>{'+' + SKIP_SECONDS}</button>
      <p>Time: {formatTime(time) + '/' + formatTime(duration)}</p>
    </div>
  );
};

export default VideoControls;

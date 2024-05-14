
interface VideoControlsProps {
  close: () => void;
  toggle: () => void;
  advance: () => void;
  isPlaying: boolean;
}

const VideoControls = ({ close, toggle, advance, isPlaying }: VideoControlsProps) => {
  return (
    <div className="video-controls">
      <button onClick={close}>Close</button>
      <button onClick={toggle}>{isPlaying ? 'Pause' : 'Resume'}</button>
      <button onClick={advance}>+10</button>
    </div>
  );
};

export default VideoControls;

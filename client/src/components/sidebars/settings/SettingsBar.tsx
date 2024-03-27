import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  selectAutoplay,
  selectAutoqueue,
  selectShowVideoDetails,
  toggleAutoplay,
  toggleAutoqueue,
  toggleShowVideoDetails,
} from '../../../redux/reducers/settingsSlice';

interface SettingsBarProps {
  close: () => void;
}

const SettingsBar = ({ close }: SettingsBarProps) => {
  const dispatch = useAppDispatch();

  // whether playing album is automatically started
  const autoplay = useAppSelector(selectAutoplay);

  // play to the next album in queue after the playing album ends
  const autoqueue = useAppSelector(selectAutoqueue);

  const showVideoDetails = useAppSelector(selectShowVideoDetails);

  return (
    <div className="sidebar">
      <div className="sidebar-toolbar">
        <h2>Settings</h2>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className="sidebar-container">
        <button onClick={() => dispatch(toggleAutoplay())}>
          {autoplay ? 'Disable' : 'Enable'} autoplay
        </button>
        <button onClick={() => dispatch(toggleAutoqueue())}>
          {autoqueue ? 'Disable' : 'Enable'} autoqueue
        </button>
        <button onClick={() => dispatch(toggleShowVideoDetails())}>
          {showVideoDetails ? 'Hide' : 'Show'} video details
        </button>
      </div>
    </div>
  );
};

export default SettingsBar;

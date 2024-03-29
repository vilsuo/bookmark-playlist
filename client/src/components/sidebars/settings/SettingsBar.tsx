import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

import {
  selectAutoplay,
  selectAutoqueue,
  selectShowVideoDetails,
  toggleAutoplay,
  toggleAutoqueue,
  toggleShowVideoDetails,
} from '../../../redux/reducers/settingsSlice';
import SettingsCheckbox from './SettingsCheckbox';

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
    <div id="settings-bar" className="sidebar">
      <div className="sidebar-toolbar">
        <h2>Settings</h2>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className="sidebar-container">
        <div className="settings">
          <SettingsCheckbox
            value={autoplay}
            toggle={() => dispatch(toggleAutoplay())}
            label='Autoplay'
            details='When an album is played, the video will autoplay'
          />
          <SettingsCheckbox
            value={autoqueue}
            toggle={() => dispatch(toggleAutoqueue())}
            label='Autoqueue'
            details='Autoselect next album from queue when a video ends'
          />
          <SettingsCheckbox
            value={showVideoDetails}
            toggle={() => dispatch(toggleShowVideoDetails())}
            label='Show playing album details'
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;

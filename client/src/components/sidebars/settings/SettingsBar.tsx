import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

import {
  selectAutoplay,
  selectAutoqueue,
  selectPlayMode,
  selectShowVideoDetails,
  setPlayMode,
  toggleAutoplay,
  toggleAutoqueue,
  toggleShowVideoDetails,
} from '../../../redux/reducers/settingsSlice';
import { PlayMode } from '../../../types';
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

  const playMode = useAppSelector(selectPlayMode);

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
            details='Selected video will autoplay'
          />
          <SettingsCheckbox
            value={autoqueue}
            toggle={() => dispatch(toggleAutoqueue())}
            label='Autoqueue'
            details='Select the next album when a video ends'
          />
          <SettingsCheckbox
            value={showVideoDetails}
            toggle={() => dispatch(toggleShowVideoDetails())}
            label='Show playing album details'
          />
          <div className='settings-select'>
            <div>
              <label htmlFor='playMode-select'>Play mode</label>
              <select
                id="playMode-select"
                value={playMode}
                onChange={({ target }) =>
                  { dispatch(setPlayMode(target.value as PlayMode)); }
                }
              >
                <option value={PlayMode.MANUAL}>{PlayMode.MANUAL}</option>
                <option value={PlayMode.SEQUENCE}>{PlayMode.SEQUENCE}</option>
                <option value={PlayMode.SHUFFLE}>{PlayMode.SHUFFLE}</option>
              </select>
            </div>

            <p className='info'>
              Select how to choose the next album from the list when one ends.
              Queued albums are always prioritized
            </p>

            <ul>
              <li>
                <p><span>{PlayMode.MANUAL}</span> do not choose an album</p>
              </li>
              <li>
                <p><span>{PlayMode.SEQUENCE}</span> choose the next album</p>
              </li>
              <li>
                <p><span>{PlayMode.SHUFFLE}</span> choose random albums</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;

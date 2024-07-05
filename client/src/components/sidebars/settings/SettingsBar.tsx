import SideBarBase from '../SideBarBase';
import SettingsPlayMode from './SettingsPlayMode';
import SettingsToggleOptions from './SettingsToggles';

const SettingsBarHeader = () => <h2>Settings</h2>;

const SettingsBarContent = () => {
  return (
    <div className="settings-bar-content">
      <SettingsToggleOptions />
      <SettingsPlayMode />
    </div>
  )
};

interface SettingsBarProps {
  close: () => void;
}

const SettingsBar = ({ close }: SettingsBarProps) => {

  return(
    <SideBarBase
      close={close}
      header={ <SettingsBarHeader /> }
      content={ <SettingsBarContent /> }
    />
  );
};

export default SettingsBar;

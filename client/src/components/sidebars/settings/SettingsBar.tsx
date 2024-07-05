import SideBarBase from '../SidebarBase';
import SettingsPlayMode from './SettingsPlayMode';
import SettingsToggleOptions from './SettingsToggles';

const SettingsBarHeader = () => <h2>Settings</h2>;

const SettingsBarContent = () => {
  return (
    <div className="settings-bar-content">
      <SettingsToggleOptions />
      <SettingsPlayMode />
    </div>
  );
};

interface SettingsBarProps {
  close: (pos: number | undefined) => void;
  pos: number;
};

const SettingsBar = ({ close, pos }: SettingsBarProps) => {
  return(
    <SideBarBase
      pos={pos}
      close={close}
      header={ <SettingsBarHeader /> }
      content={ <SettingsBarContent /> }
    />
  );
};

export default SettingsBar;

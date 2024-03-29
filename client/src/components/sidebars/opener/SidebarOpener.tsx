import { SidebarType } from '../../../types';
import AlbumsButton from './AlbumsButton';
import SettingsButton from './SettingsButton';
import ToolsButton from './ToolsButton';

interface SidebarOpenerProps {
  show: (sidebar: SidebarType) => void;
};

const SidebarOpener = ({ show }: SidebarOpenerProps) => {
  return (
    <div className="sidebar-opener">
      <AlbumsButton show={() => show(SidebarType.ALBUMS)} />
      <ToolsButton show={() => show(SidebarType.TOOLS)} />
      <SettingsButton show={() => show(SidebarType.SETTINGS)} />
    </div>
  );
};

export default SidebarOpener;

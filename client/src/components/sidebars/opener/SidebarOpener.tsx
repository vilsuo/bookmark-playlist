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
      <SettingsButton show={() => show(SidebarType.SETTINGS)} />
      <ToolsButton show={() => show(SidebarType.TOOLS)} />
    </div>
  );
};

export default SidebarOpener;

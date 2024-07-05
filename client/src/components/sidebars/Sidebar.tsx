import { SidebarType } from '../../types';
import AlbumsBar from './albums/AlbumsBar';
import ToolsBar from './tools/ToolsBar';
import SettingsBar from './settings/SettingsBar';

interface SidebarProps {
  sidebarType: SidebarType;
  close: () => void;
  scrollPos: Partial<Record<SidebarType, number>>;
  addScrollPos: (type: SidebarType, pos: number | undefined) => void;
};

const Sidebar = ({ sidebarType, close, scrollPos, addScrollPos }: SidebarProps) => {

  const closeAndSaveScrollPos = (pos: number | undefined) => {
    addScrollPos(sidebarType, pos);
    close();
  };

  const pos = scrollPos[sidebarType] ? scrollPos[sidebarType] : 0;

  switch(sidebarType) {
    case SidebarType.ALBUMS: {
      return (
        <AlbumsBar
          close={closeAndSaveScrollPos}
          pos={pos}
        />
      );
    }
    case SidebarType.TOOLS: {
      return (
        <ToolsBar
          close={close}
        />
      );
    }
    case SidebarType.SETTINGS: {
      return (
        <SettingsBar 
          close={closeAndSaveScrollPos}
          pos={pos}
        />
      );
    }
    default:
      sidebarType satisfies never;
  }
};

export default Sidebar;

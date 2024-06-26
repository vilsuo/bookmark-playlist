import { SidebarType } from '../../types';
import AlbumsBar from './albums/AlbumsBar';
import ToolsBar from './tools/ToolsBar';
import SettingsBar from './settings/SettingsBar';

interface SidebarProps {
  sidebarType: SidebarType;
  close: () => void;
  scrollPos: number;
  setScrollPos: (val: number) => void;
};

const Sidebar = ({ sidebarType, close, scrollPos, setScrollPos }: SidebarProps) => {

  const closeAndSaveScrollPos = (pos: number | undefined) => {
    setScrollPos(pos || 0);
    close();
  };

  switch(sidebarType) {
    case SidebarType.ALBUMS: {
      return (
        <AlbumsBar
          close={closeAndSaveScrollPos}
          pos={scrollPos}
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
          close={close}
        />
      );
    }
    default:
      sidebarType satisfies never;
  }
};

export default Sidebar;

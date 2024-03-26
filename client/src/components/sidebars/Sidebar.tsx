import { Album, SidebarType } from '../../types';
import AlbumsBar from './albums/Albumsbar';
import SettingsBar from './settings/SettingsBar';

interface SidebarProps {
  type: SidebarType;
  close: () => void;
  upload: (formData: FormData) => Promise<void>;
  albums: Album[];
};

const Sidebar = ({ type, close, upload, albums }: SidebarProps) => {
  switch(type) {
    case SidebarType.ALBUMS: {
      return (
        <AlbumsBar
          upload={upload}
          albums={albums}
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
      throw new Error(`No sidebar for type ${type}`);
  }
};

export default Sidebar;

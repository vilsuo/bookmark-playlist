import { Album, SidebarType } from "../../types";
import AlbumsBar from "./albums/Albumsbar";
import SettingsBar from "./settings/SettingsBar";

interface SidebarProps {
  type: SidebarType;
  setType: (type: SidebarType | null) => void;

  handleUpload: (formData: FormData) => Promise<void>;
  albums: Album[];
};

const Sidebar = ({ type, setType, handleUpload, albums }: SidebarProps) => {

  const close = () => setType(null);

  switch(type) {
    case SidebarType.ALBUMS: {
      return (
        <AlbumsBar
          handleUpload={handleUpload}
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

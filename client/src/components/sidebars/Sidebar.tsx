import { Album, SidebarType } from "../../types";
import AlbumsBar from "./albums/Albumsbar";
import SettingsBar from "./settings/SettingsBar";

interface SidebarProps {
  type: SidebarType;
  setType: (type: SidebarType | null) => void;

  handleUpload: (formData: FormData) => Promise<void>;
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
};

const Sidebar = ({ type, setType, handleUpload, albums, playingAlbum, setPlayingAlbum }: SidebarProps) => {

  const close = () => setType(null);

  switch(type) {
    case SidebarType.ALBUMS: {
      return (
        <AlbumsBar
          handleUpload={handleUpload}
          albums={albums}
          playingAlbum={playingAlbum}
          setPlayingAlbum={setPlayingAlbum}
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

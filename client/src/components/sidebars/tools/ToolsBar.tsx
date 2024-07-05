import SideBarBase from '../SidebarBase';
import AlbumDownloader from './AlbumDownloader';
import BookmarkConverter from './BookmarkConverter';

const ToolsBarHeader = () => <h2>Tools</h2>;

const ToolsBarContent = () => {
  return (
    <div className="tools-bar-content">
      <BookmarkConverter />
      <AlbumDownloader />
    </div>
  );
};

interface ToolsBarProps {
  close: () => void;
};

const ToolsBar = ({ close }: ToolsBarProps) => {
  return(
    <SideBarBase
      close={close}
      header={ <ToolsBarHeader /> }
      content={ <ToolsBarContent /> }
    />
  );
};

export default ToolsBar;

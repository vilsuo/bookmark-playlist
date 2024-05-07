import BookmarkConverter from './BookmarkConverter';

interface ToolsBar {
  close: () => void;
}

const ToolsBar = ({ close }: ToolsBar) => {
  return (
    <div id="tools-bar" className="sidebar">
      <div className="sidebar-toolbar">
        <h2>Tools</h2>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className="sidebar-container">
        <BookmarkConverter />
      </div>
    </div>
  );
};

export default ToolsBar;

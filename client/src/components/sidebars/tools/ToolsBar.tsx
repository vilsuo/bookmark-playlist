import BookmarkConverter from '../settings/BookmarkConverter';
import * as converterService from '../../../util/converterService';

interface ToolsBar {
  close: () => void;
}

const ToolsBar = ({ close }: ToolsBar) => {
  const handleConvert = async (formData: FormData) => {
    await converterService.downloadBookmarks(formData);
  };

  return (
    <div id="tools-bar" className="sidebar">
      <div className="sidebar-toolbar">
        <h2>Tools</h2>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className="sidebar-container">
        <BookmarkConverter upload={handleConvert} />
      </div>
    </div>
  );
};

export default ToolsBar;

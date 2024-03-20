import { useState } from 'react';
import BookmarkForm from './BookmarkForm';

// albums
import AlbumFilter, { FilterOptions } from './album/AlbumFilter';
import AlbumTable from './album/AlbumTable';
import { Album, AlbumColumn } from '../types';

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  text: '',
  column: AlbumColumn.ARTIST,
  interval: { start: '', end: '' }
};

interface SidebarProps {
  handleUpload: (formData: FormData) => Promise<void>;
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
  close: () => void;
}

// TODO
// - add buttons to scroll to top/bottom of album table
// - fix album table extra row when only 1 album
const Sidebar = ({ handleUpload, albums, playingAlbum, setPlayingAlbum, close }: SidebarProps) => {
  const [showUpload, setShowUpload] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);

  const toggleUpload = () => setShowUpload(!showUpload);

  return (
    <div className='sidebar'>
      <div className='sidebar-toolbar'>
        <h2>Albums</h2>
        <button onClick={toggleUpload}>Toggle upload</button>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className='sidebar-container'>
        { showUpload && (
          <BookmarkForm upload={handleUpload} />
        )}

        <AlbumFilter
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />

        { (albums.length > 0) && (
          <AlbumTable
            albums={albums}
            playingAlbum={playingAlbum}
            setPlayingAlbum={setPlayingAlbum}
            filter={filterOptions.text.toLowerCase()}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;

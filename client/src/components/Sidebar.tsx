import React, { useRef, useState } from 'react';
import BookmarkForm from './BookmarkForm';

// albums
import AlbumFilter, { FilterOptions } from './album/AlbumFilter';
import AlbumTable from './album/AlbumTable';
import { Album, AlbumColumn } from '../types';

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  column: AlbumColumn.ARTIST,
  text: '',
  interval: { start: '', end: '' }
};

interface SidebarProps {
  handleUpload: (formData: FormData) => Promise<void>;
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
  close: () => void;
}

const Sidebar = ({ handleUpload, albums, playingAlbum, setPlayingAlbum, close }: SidebarProps) => {
  const [showUpload, setShowUpload] = useState(albums.length === 0);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);

  const startRef = useRef<null | HTMLDivElement>(null);
  const endRef = useRef<null | HTMLDivElement>(null);

  const scrollTo = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleUpload = () => setShowUpload(!showUpload);

  return (
    <div className='sidebar'>
      <div className='sidebar-toolbar'>
        <button onClick={() => scrollTo(startRef)}>Up</button>
        <button onClick={() => scrollTo(endRef)}>Down</button>
        <h2>Albums</h2>
        <button onClick={toggleUpload}>Toggle upload</button>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className='sidebar-container'>
        <div id='start-ref' ref={startRef} />

        { showUpload && (
          <BookmarkForm upload={handleUpload} />
        )}

        { (albums.length > 0) && (
          <React.Fragment>
            <AlbumFilter
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
            />

            <AlbumTable
              albums={albums}
              playingAlbum={playingAlbum}
              setPlayingAlbum={setPlayingAlbum}
              filterOptions={filterOptions}
            />
          </React.Fragment>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default Sidebar;
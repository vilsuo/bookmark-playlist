import React, { useRef, useState } from 'react';

import BookmarkForm from './BookmarkForm';

// albums
import AlbumFilter from '../../album/AlbumFilter';
import AlbumTable from '../../album/AlbumTable';

import { Album } from '../../../types';
import AlbumsView from './AlbumsView';

interface AlbumsBarProps {
  handleUpload: (formData: FormData) => Promise<void>;
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
  close: () => void;
}

const AlbumsBar = ({
  handleUpload,
  albums,
  playingAlbum,
  setPlayingAlbum,
  close,
}: AlbumsBarProps) => {
  const [showUpload, setShowUpload] = useState(albums.length === 0);

  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);

  const startRef = useRef<null | HTMLDivElement>(null);
  const endRef = useRef<null | HTMLDivElement>(null);

  const scrollTo = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleUpload = () => setShowUpload(!showUpload);

  return (
    <div className="sidebar albums-bar">
      <div className="sidebar-toolbar">
        <button onClick={() => scrollTo(startRef)}>Up</button>
        <button onClick={() => scrollTo(endRef)}>Down</button>
        <h2>Albums</h2>
        <button onClick={toggleUpload}>Toggle import</button>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className={`sidebar-container ${viewingAlbum ? 'album-viewed' : ''}`}>
        <div id="start-ref" ref={startRef} />

        {showUpload && <BookmarkForm upload={handleUpload} />}

        {albums.length > 0 && (
          <React.Fragment>
            <AlbumFilter />

            <AlbumTable
              albums={albums}
              playingAlbum={playingAlbum}
              viewingAlbum={viewingAlbum}
              setViewingAlbum={setViewingAlbum}
            />

          </React.Fragment>
        )}

        <div id="end-ref" ref={endRef} />
      </div>

      {viewingAlbum && (
        <AlbumsView
          album={viewingAlbum}
          close={(() => setViewingAlbum(null))}
          play={() => setPlayingAlbum(viewingAlbum)}
        />
      )}
    </div>
  );
};

export default AlbumsBar;

import React, { useRef, useState } from 'react';

import BookmarkForm from './BookmarkForm';

// albums
import AlbumFilter from '../../album/AlbumFilter';
import AlbumTable from '../../album/AlbumTable';

import { Album } from '../../../types';

interface AlbumsBarProps {
  handleUpload: (formData: FormData) => Promise<void>;
  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
  close: () => void;
}

const AlbumsBar = ({ handleUpload, albums, playingAlbum, setPlayingAlbum, close }: AlbumsBarProps) => {
  const [showUpload, setShowUpload] = useState(albums.length === 0);

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
        <button onClick={toggleUpload}>Toggle import</button>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div id='start-ref' ref={startRef} />
      
      <div className='sidebar-container'>
        { showUpload && (
          <BookmarkForm upload={handleUpload} />
        )}

        { (albums.length > 0) && (
          <React.Fragment>
            {/*
            <a
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(albums)
              )}`}
              download="filename.json"
            >
              Download
            </a>
            */}

            <AlbumFilter />

            <AlbumTable
              albums={albums}
              playingAlbum={playingAlbum}
              setPlayingAlbum={setPlayingAlbum}
            />
          </React.Fragment>
        )}
      </div>
      <div ref={endRef} />
    </div>
  );
};

export default AlbumsBar;

import React, { useRef, useState } from 'react';
import BookmarkForm from './BookmarkForm';
import AlbumFilter from '../../album/AlbumFilter';
import AlbumTable from '../../album/AlbumTable';
import { Album } from '../../../types';
import AlbumsView from './AlbumsView';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { play, selectPlaying, selectViewing, view } from '../../../redux/reducers/albumsSlice';

interface AlbumsBarProps {
  upload: (formData: FormData) => Promise<void>;
  albums: Album[];
  close: () => void;
}

const AlbumsBar = ({
  upload,
  albums,
  close,
}: AlbumsBarProps) => {
  const [showUploadForm, setShowUploadForm] = useState(albums.length === 0);

  const dispatch = useAppDispatch();
  const playingAlbum = useAppSelector(selectPlaying);
  const viewingAlbum = useAppSelector(selectViewing);
  const setPlayingAlbum = (album: Album | null) => dispatch(play(album));
  const setViewingAlbum = (album: Album | null) => dispatch(view(album));

  const startRef = useRef<null | HTMLDivElement>(null);
  const endRef = useRef<null | HTMLDivElement>(null);

  const scrollTo = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleUpload = () => setShowUploadForm(!showUploadForm);

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

        {showUploadForm && <BookmarkForm upload={upload} />}

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

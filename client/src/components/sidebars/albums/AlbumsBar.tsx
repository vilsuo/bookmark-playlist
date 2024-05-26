import React, { useRef, useState } from 'react';
import AlbumFilter from '../../album/AlbumFilter';
import AlbumTable from '../../album/AlbumTable';
import { Album } from '../../../types';
import AlbumsView from './AlbumsView';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { play, selectPlaying, selectViewing, view } from '../../../redux/reducers/albumsSlice';
import AlbumAddDialog from './AlbumAddDialog';

interface AlbumsBarProps {
  albums: Album[];
  close: () => void;
}

const AlbumsBar = ({
  albums,
  close,
}: AlbumsBarProps) => {
  const dispatch = useAppDispatch();
  const playingAlbum = useAppSelector(selectPlaying);
  const viewingAlbum = useAppSelector(selectViewing);
  const setPlayingAlbum = (album: Album | null) => dispatch(play(album));
  const setViewingAlbum = (album: Album | null) => dispatch(view(album));

  const [isAddOpen, setIsAddOpen] = useState(false);

  const startRef = useRef<null | HTMLDivElement>(null);
  const endRef = useRef<null | HTMLDivElement>(null);

  const scrollTo = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="albums-bar" className="sidebar">
      <div className="sidebar-toolbar">
        <button onClick={() => scrollTo(startRef)}>&#x21D1;</button>
        <button onClick={() => scrollTo(endRef)}>&#x21D3;</button>
        <h2>Albums</h2>
        <button onClick={() => setIsAddOpen(true)}>New</button>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className={`sidebar-container ${viewingAlbum ? 'album-viewed' : ''}`}>
        <div id="start-ref" ref={startRef} />

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

      { viewingAlbum && (
        <AlbumsView
          album={viewingAlbum}
          isPlaying={playingAlbum !== null && viewingAlbum.id === playingAlbum.id}
          close={(() => setViewingAlbum(null))}
          play={() => setPlayingAlbum(viewingAlbum)}
        />
      )}

      { isAddOpen && (
        <AlbumAddDialog
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />
      )}
    </div>
  );
};

export default AlbumsBar;

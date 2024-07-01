import React, { useEffect, useRef, useState } from 'react';
import AlbumFilter from './filters/AlbumFilter';
import AlbumTable from '../../album/AlbumTable';
import { Album } from '../../../types';
import AlbumsView from './AlbumsView';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectViewing, view } from '../../../redux/reducers/albumsSlice';
import AlbumAddDialog from './AlbumAddDialog';

interface AlbumsBarProps {
  close: (pos: number | undefined) => void;
  pos: number;
}

const AlbumsBar = ({ close, pos }: AlbumsBarProps) => {
  const viewingAlbum = useAppSelector(selectViewing);

  const dispatch = useAppDispatch();
  const setViewingAlbum = (album: Album | null) => dispatch(view(album));

  const [isAddOpen, setIsAddOpen] = useState(false);

  const listRef = useRef<null | HTMLDivElement>(null)
  const startRef = useRef<null | HTMLDivElement>(null);
  const endRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: pos, behavior: 'instant' });
  }, [pos]);

  const getScrollPosition = () => {
    return listRef.current?.scrollTop;
  };

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
        <button onClick={() => close(getScrollPosition())}>&#x2715;</button>
      </div>

      <div ref={listRef} className={`sidebar-container ${viewingAlbum ? 'album-viewed' : ''}`}>
        <div id="start-ref" ref={startRef} />
          <AlbumFilter />

          <AlbumTable
            viewingAlbum={viewingAlbum}
            setViewingAlbum={setViewingAlbum}
          />
        <div id="end-ref" ref={endRef} />
      </div>

      { viewingAlbum && (
        <AlbumsView
          album={viewingAlbum}
          close={(() => setViewingAlbum(null))}
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

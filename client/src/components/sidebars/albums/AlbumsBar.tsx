import React, { Fragment, useEffect, useRef, useState } from 'react';
import AlbumFilter from './filters/AlbumFilter';
import AlbumTable from './table/AlbumTable';
import AlbumsView from './AlbumsView';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectViewing, setViewingAlbum } from '../../../redux/reducers/albums/albumsSlice';
import AlbumAddDialog from './AlbumAddDialog';
import SideBarBase from '../SidebarBase';

interface AlbumsBarHeaderProps {
  scrollToStart: () => void;
  scrollToEnd: () => void;
  openAdd: () => void;
};

const AlbumsBarHeader = (
  { scrollToStart, scrollToEnd, openAdd }: AlbumsBarHeaderProps
) => {
  return (
    <Fragment>
      <button onClick={scrollToStart}>&#x21D1;</button>
      <button onClick={scrollToEnd}>&#x21D3;</button>
      <h2>Albums</h2>
      <button onClick={openAdd}>New</button>
    </Fragment>
  );
};

interface AlbumsBarContentProps {
  listRef: React.MutableRefObject<HTMLDivElement | null>;
  startRef: React.MutableRefObject<HTMLDivElement | null>;
  endRef: React.MutableRefObject<HTMLDivElement | null>;
  isAddOpen: boolean;
  closeAdd: () => void;
};

const AlbumsBarContent = (
  { listRef, startRef, endRef, isAddOpen, closeAdd }: AlbumsBarContentProps
) => {
  const viewingAlbum = useAppSelector(selectViewing);

  const dispatch = useAppDispatch();

  return (
    <div className="albums-bar-content">
      <div ref={listRef} className={`album-filter-list ${viewingAlbum ? 'viewed' : ''}`}>
        <div id="start-ref" ref={startRef} />

        <AlbumFilter />

        <AlbumTable />

        <div id="end-ref" ref={endRef} />
      </div>

      { viewingAlbum && (
        <AlbumsView
          album={viewingAlbum}
          close={(() => dispatch(setViewingAlbum(null)))}
        />
      )}

      { isAddOpen && (
        <AlbumAddDialog
          isOpen={isAddOpen}
          onClose={closeAdd}
        />
      )}
    </div>
  );
};

interface AlbumsBarProps {
  close: (pos: number | undefined) => void;
  pos: number;
};

const AlbumsBar = ({ close, pos }: AlbumsBarProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const listRef = useRef<null | HTMLDivElement>(null);
  
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
    <SideBarBase
      width={600}
      close={() => close(getScrollPosition())}
      header={
        <AlbumsBarHeader
          scrollToStart={() => scrollTo(startRef)}
          scrollToEnd={() => scrollTo(endRef)}
          openAdd={() => setIsAddOpen(true)}
        />
      }
      content={
        <AlbumsBarContent
          listRef={listRef}
          startRef={startRef}
          endRef={endRef}
          isAddOpen={isAddOpen}
          closeAdd={() => setIsAddOpen(false)}
        />
      }
    />
  );
};

export default AlbumsBar;

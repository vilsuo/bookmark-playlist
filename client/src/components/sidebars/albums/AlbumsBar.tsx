import React, { Fragment, useRef, useState } from 'react';
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
  startRef: React.MutableRefObject<HTMLDivElement | null>;
  endRef: React.MutableRefObject<HTMLDivElement | null>;
  isAddOpen: boolean;
  closeAdd: () => void;
};

const AlbumsBarContent = (
  { startRef, endRef, isAddOpen, closeAdd }: AlbumsBarContentProps
) => {
  return (
    <div className="albums-bar-content">
      <div className="album-filter-list">
        <div id="start-ref" ref={startRef} />

        <AlbumFilter />

        <AlbumTable />

        <div id="end-ref" ref={endRef} />
      </div>

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
  
  const startRef = useRef<null | HTMLDivElement>(null);
  const endRef = useRef<null | HTMLDivElement>(null);

  const viewingAlbum = useAppSelector(selectViewing);

  const dispatch = useAppDispatch();

  const scrollTo = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SideBarBase
      pos={pos}
      width={600}
      close={close}
      header={
        <AlbumsBarHeader
          scrollToStart={() => scrollTo(startRef)}
          scrollToEnd={() => scrollTo(endRef)}
          openAdd={() => setIsAddOpen(true)}
        />
      }
      content={
        <AlbumsBarContent
          startRef={startRef}
          endRef={endRef}
          isAddOpen={isAddOpen}
          closeAdd={() => setIsAddOpen(false)}
        />
      }
      footer={
        viewingAlbum && (
          <AlbumsView
            album={viewingAlbum}
            close={(() => dispatch(setViewingAlbum(null)))}
          />
        )
      }
    />
  );
};

export default AlbumsBar;

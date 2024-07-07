import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { queueAdd } from '../../../redux/reducers/queueSlice';
import { Album } from '../../../types';
import AlbumEditDialog from './AlbumEditDialog';
import { setPlayingAlbum, selectIsPlaying } from '../../../redux/reducers/albums/albumsSlice';

interface AlbumsViewProps {
  album: Album;
  close: () => void;
};

const AlbumsView = ({ album, close }: AlbumsViewProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const isPlaying = useAppSelector(state => selectIsPlaying(state, album));

  const dispatch = useAppDispatch();

  const addToQueue = () => dispatch(queueAdd(album));
  const playAlbum = () => dispatch(setPlayingAlbum(album));

  return (
    <React.Fragment>
      { isEditorOpen && (
        <AlbumEditDialog
          album={album}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      <div className="albums-view">
        <div className="header">
          <h3>Selected Album</h3>
          <button onClick={close}>&#x2715;</button>
        </div>

        <div className="content">
          <div className="actions">
            <button className="play-button" onClick={playAlbum} disabled={isPlaying}>
              Select
            </button>
            <button onClick={addToQueue}>Q</button>
            <button onClick={() => setIsEditorOpen(true)}>E</button>
          </div>

          <div className="details">
            <div>
              <span className="artist">{album.artist}</span>
            </div>
            <div>
              <span className="title">{album.title}</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AlbumsView;

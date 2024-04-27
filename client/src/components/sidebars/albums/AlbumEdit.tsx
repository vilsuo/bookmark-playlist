import { useEffect, useState } from 'react';
import { Album } from '../../../types';
import * as albumService from '../../../util/albumService';
import { getErrorMessage } from '../../../util/axiosErrors';
import DragDialog from '../../general/DragDialog';

interface DialogOptionsProps {
  album: Album;
  onClose: () => void;
}

const DialogOptions = ({ album, onClose }: DialogOptionsProps) => {
  const updateAndClose = async () => {
    try {
      await albumService.update(album);

      console.log('updated');
      onClose();

    } catch (error: unknown) {
      alert(getErrorMessage(error));
    }
  };

  const removeAndClose = async () => {
    try {
      await albumService.remove(album.id);

      console.log('removed');
      onClose();

    } catch (error: unknown) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <div className="options">
      <button onClick={updateAndClose}>Ok</button>
      <button onClick={removeAndClose}>Remove</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

interface AlbumEditProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
}

const AlbumEdit = ({ album, isOpen, onClose }: AlbumEditProps) => {
  const [artist, setArtist] = useState(album.artist);
  const [title, setTitle] = useState(album.title);
  const [published, setPublished] = useState(album.published);
  const [videoId, setVideoId] = useState(album.videoId);

  useEffect(() => {
    setArtist(album.artist);
    setTitle(album.title);
    setPublished(album.published);
    setVideoId(album.videoId);
  }, [album, isOpen]);

  return (
    <DragDialog
      title='Edit album'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="album-form">
        <label>
          <span>Artist:</span>
          <input
            type='text'
            value={artist}
            onChange={({ target }) => setArtist(target.value)}
          />
        </label>
        <label>
          <span>Title:</span>
          <input
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <label>
          <span>Published:</span>
          <input
            type='number'
            min={1000}
            max={9999}
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </label>
        <label>
          <span>Video id:</span>
          <input
            type='text'
            value={videoId}
            onChange={({ target }) => setVideoId(target.value)}
          />
        </label>
      </div>

      <DialogOptions
        album={ { ...album, artist, title, published, videoId } }
        onClose={onClose}
      />
    </DragDialog>
  );
};

export default AlbumEdit;

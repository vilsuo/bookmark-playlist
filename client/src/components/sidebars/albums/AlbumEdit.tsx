import { useEffect, useState } from 'react';
import { Album } from '../../../types';
import * as albumService from '../../../util/albumService';
import { getErrorMessage } from '../../../util/axiosErrors';
import DragDialog from '../../general/DragDialog';

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

  const handleSubmit = async () => {
    try {
      const updated = await albumService.update({
        ...album,
        artist, title, published, videoId,
      });

      console.log('updated', updated.videoId);
    } catch (error: unknown) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <DragDialog
      title='Edit album'
      isOpen={isOpen}
      onProceed={handleSubmit}
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
    </DragDialog>
  );
};

export default AlbumEdit;

import { useState } from 'react';
import { Album } from '../../../types';
import ToggleDialog from '../../general/ToggleDialog';
import * as albumService from '../../../util/albumService';

interface AlbumEditProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
}

const AlbumEdit = ({ album, isOpen, onClose }: AlbumEditProps) => {
  // const [artist, setArtist] = useState(album.artist);
  // const [title, setTitle] = useState(album.title);
  // const [published, setPublished] = useState(album.published);
  const [videoId, setVideoId] = useState(album.videoId);

  const handleSubmit = async () => {
    console.log('SUBMITTING...', album.videoId);

    const updated = await albumService.update({ ...album, videoId: videoId });

    console.log('updated', updated.videoId);
  };

  return (
    <ToggleDialog
      title='Edit'
      isOpen={isOpen}
      onProceed={handleSubmit}
      onClose={onClose}
    >
      <div className="album-form">
        <p>{album.artist} - {album.title}</p>
        <label>
          <span>Video id:</span>
          <input
            type='text'
            value={videoId}
            onChange={({ target }) => setVideoId(target.value)}
          />
        </label>
      </div>
    </ToggleDialog>
  );
};

export default AlbumEdit;

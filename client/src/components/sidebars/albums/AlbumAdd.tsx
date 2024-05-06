import { useState } from 'react';
import DragDialog from '../../general/DragDialog';
import { useAppDispatch } from '../../../redux/hooks';
import * as albumService from '../../../util/albumService';
import { NotificationType } from '../../../types';
import { addNotification } from '../../../redux/reducers/notificationSlice';
import { getErrorMessage } from '../../../util/axiosErrors';

interface AlbumAddProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlbumAdd = ({ isOpen, onClose }: AlbumAddProps) => {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [published, setPublished] = useState(2000);
  const [category, setCategory] = useState('');
  const [videoId, setVideoId] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const albumValues = { artist, title, published, category, videoId };
    try {
      await albumService.create(albumValues);
      dispatch(addNotification({
        title: 'Album added successfully',
        type: NotificationType.SUCCESS,
      }));
      onClose();

    } catch (error: unknown) {
      dispatch(addNotification({
        title: 'Album adding failed',
        message: getErrorMessage(error),
        type: NotificationType.ERROR,
      }));
    }
  };

  return (
    <DragDialog
      title='Add album'
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="album-form" onSubmit={handleSubmit}>
        <label>
          <span>Artist:*</span>
          <input
            type='text'
            value={artist}
            onChange={({ target }) => setArtist(target.value)}
            required
          />
        </label>
        <label>
          <span>Title:</span>
          <input
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
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
            required
          />
        </label>
        <label>
          <span>Category:</span>
          <input
            type='text'
            value={category}
            onChange={({ target }) => setCategory(target.value)}
            required
          />
        </label>
        <label>
          <span>Video id:</span>
          <input
            type='text'
            value={videoId}
            onChange={({ target }) => setVideoId(target.value)}
            required
          />
        </label>

        <div className="options">
          <button type='submit'>Add</button>
          <button type='button' onClick={onClose}>Cancel</button>
        </div>
      </form>
    </DragDialog>
  );
};

export default AlbumAdd;

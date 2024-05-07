import DragDialog from '../../general/DragDialog';
import { useAppDispatch } from '../../../redux/hooks';
import { AlbumCreation, NotificationType } from '../../../types';
import { addNotification } from '../../../redux/reducers/notificationSlice';
import { getThunkError } from '../../../util/errorMessages';
import AlbumForm from './AlbumForm';
import { createAlbum } from '../../../redux/reducers/albumsSlice';

interface AlbumAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultValues = {
  artist: '',
  title: '',
  published: 2000,
  category: '',
  videoId: '',
};

const AlbumAddDialog = ({ isOpen, onClose }: AlbumAddDialogProps) => {
  const dispatch = useAppDispatch();

  const addAndClose = async (albumValues: AlbumCreation) => {
    try {
      await dispatch(createAlbum(albumValues)).unwrap();

      dispatch(addNotification({
        title: 'Album added successfully',
        type: NotificationType.SUCCESS,
      }));
      onClose();

    } catch (error: unknown) {
      dispatch(addNotification({
        title: 'Album adding failed',
        type: NotificationType.ERROR,
        message: getThunkError(error),
      }));
    }
  };

  return (
    <DragDialog
      title='Add album'
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlbumForm
        album={defaultValues}
        submit={addAndClose}
      >
        <button type='submit'>Add</button>
        <button type='button' onClick={onClose}>Cancel</button>
      </AlbumForm>
    </DragDialog>
  );
};

export default AlbumAddDialog;

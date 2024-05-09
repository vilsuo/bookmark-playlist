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
        type: NotificationType.SUCCESS,
        title: 'Album added successfully',
      }));
      
      onClose();

    } catch (error: unknown) {
      dispatch(addNotification({
        type: NotificationType.ERROR,
        title: 'Album adding failed',
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

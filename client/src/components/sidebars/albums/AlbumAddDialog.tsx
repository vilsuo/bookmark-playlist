import DragDialog from '../../general/DragDialog';
import { useAppDispatch } from '../../../redux/hooks';
import * as albumService from '../../../util/albumService';
import { AlbumCreation, NotificationType } from '../../../types';
import { addNotification } from '../../../redux/reducers/notificationSlice';
import { getErrorMessage } from '../../../util/errorMessages';
import AlbumForm from './AlbumForm';

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

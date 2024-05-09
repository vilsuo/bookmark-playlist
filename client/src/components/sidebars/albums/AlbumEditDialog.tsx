import { Album, AlbumCreation, NotificationType } from '../../../types';
import { getThunkError } from '../../../util/errorMessages';
import DragDialog from '../../general/DragDialog';
import { useAppDispatch } from '../../../redux/hooks';
import { addNotification } from '../../../redux/reducers/notificationSlice';
import AlbumForm from './AlbumForm';
import { deleteAlbum, updateAlbum } from '../../../redux/reducers/albumsSlice';

interface AlbumEditDialogProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
}

const AlbumEditDialog = ({ album, isOpen, onClose }: AlbumEditDialogProps) => {
  const dispatch = useAppDispatch();

  const updateAndClose = async (albumValues: AlbumCreation) => {
    try {
      await dispatch(updateAlbum({ ...album, ...albumValues })).unwrap();

      dispatch(addNotification({
        type: NotificationType.SUCCESS,
        title: 'Album edited successfully',
      }));

      onClose();

    } catch (error: unknown) {
      dispatch(addNotification({
        type: NotificationType.ERROR,
        title: 'Album edit failed',
        message: getThunkError(error),
      }));
    }
  };

  const removeAndClose = async () => {
    try {
      await dispatch(deleteAlbum(album.id)).unwrap();

      dispatch(addNotification({
        type: NotificationType.SUCCESS,
        title: 'Album removed successfully',
      }));

      onClose();

    } catch (error: unknown) {
      dispatch(addNotification({
        type: NotificationType.ERROR,
        title: 'Album deletion failed',
        message: getThunkError(error),
      }));
    }
  };

  return (
    <DragDialog
      title='Edit album'
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlbumForm
        album={album}
        submit={updateAndClose}
      >
        <button type='submit'>Save</button>
        <button type='button' onClick={removeAndClose}>Remove</button>
        <button type='button' onClick={onClose}>Cancel</button>
      </AlbumForm>
    </DragDialog>
  );
};

export default AlbumEditDialog;

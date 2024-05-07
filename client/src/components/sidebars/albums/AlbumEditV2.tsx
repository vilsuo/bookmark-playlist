import { Album, AlbumCreation, NotificationType } from '../../../types';
import * as albumService from '../../../util/albumService';
import { getErrorMessage } from '../../../util/axiosErrors';
import DragDialog from '../../general/DragDialog';
import { useAppDispatch } from '../../../redux/hooks';
import { addNotification } from '../../../redux/reducers/notificationSlice';
import AlbumForm from './AlbumForm';

interface AlbumEditProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
}

const AlbumEditV2 = ({ album, isOpen, onClose }: AlbumEditProps) => {
  const dispatch = useAppDispatch();

  const updateAndClose = async (albumValues: AlbumCreation) => {
    try {
      await albumService.update({ ...album, ...albumValues });
      dispatch(addNotification({
        title: 'Album edited successfully',
        type: NotificationType.SUCCESS,
      }));
      onClose();

    } catch (error: unknown) {
      dispatch(addNotification({
        title: 'Album edit failed',
        message: getErrorMessage(error),
        type: NotificationType.ERROR,
      }));
    }
  };

  const removeAndClose = async () => {
    try {
      await albumService.remove(album.id);
      dispatch(addNotification({
        title: 'Album removed successfully',
        type: NotificationType.SUCCESS,
      }));
      onClose();

    } catch (error: unknown) {
      dispatch(addNotification({
        title: 'Album deletion failed',
        message: getErrorMessage(error),
        type: NotificationType.ERROR,
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
        <div className="options">
          <button type='submit'>Save</button>
          <button type='button' onClick={removeAndClose}>Remove</button>
          <button type='button' onClick={onClose}>Cancel</button>
        </div>
      </AlbumForm>
    </DragDialog>
  );
};

export default AlbumEditV2;

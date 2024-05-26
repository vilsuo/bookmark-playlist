import { Album, AlbumCreation, NotificationType } from '../../../types';
import { getThunkError } from '../../../util/errorMessages';
import DragDialog from '../../general/DragDialog';
import { useAppDispatch } from '../../../redux/hooks';
import { addNotification } from '../../../redux/reducers/notificationSlice';
import AlbumForm from './AlbumForm';
import { deleteAlbum, updateAlbum, view } from '../../../redux/reducers/albumsSlice';
import { useState } from 'react';
import ConfirmDialog from '../../general/ConfirmDialog';

interface AlbumEditDialogProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
}

const AlbumEditDialog = ({ album, isOpen, onClose }: AlbumEditDialogProps) => {
  const dispatch = useAppDispatch();

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

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

      // removed album is being viewed, unview it
      dispatch(view(null));

      onClose();

    } catch (error: unknown) {
      dispatch(addNotification({
        type: NotificationType.ERROR,
        title: 'Album deletion failed',
        message: getThunkError(error),
      }));
    }
  };

  const confirmAndDelete = async () => {
    await removeAndClose();
    closeConfirmDialog();
  };

  const closeConfirmDialog = () => { setIsRemoveOpen(false) };
  const openConfirmDialog = () => { setIsRemoveOpen(true); };

  return (
    <>
      <ConfirmDialog
        title='Remove album'
        isOpen={isRemoveOpen}
        onConfirm={confirmAndDelete}
        onCancel={closeConfirmDialog}
      >
        <p>
          Really remove album <span className="italic">{album.title}</span>
          by <span className="italic">{album.artist}</span>?
        </p>
      </ConfirmDialog>

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
          <button type='button' onClick={openConfirmDialog}>Remove</button>
          <button type='button' onClick={onClose}>Cancel</button>
        </AlbumForm>
      </DragDialog>
    </>
  );
};

export default AlbumEditDialog;

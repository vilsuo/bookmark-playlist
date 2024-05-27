import { Album, AlbumCreation, NotificationType } from '../../../types';
import { getThunkError } from '../../../util/errorMessages';
import DragDialog from '../../general/DragDialog';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addNotification } from '../../../redux/reducers/notificationSlice';
import AlbumForm from './AlbumForm';
import { deleteAlbum, updateAlbum } from '../../../redux/reducers/albumsSlice';
import { useState } from 'react';
import ConfirmDialog from '../../general/ConfirmDialog';
import { isQueued, queueRemove, queueUpdate } from '../../../redux/reducers/queueSlice';

interface AlbumEditDialogProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
}

const AlbumEditDialog = ({ album, isOpen, onClose }: AlbumEditDialogProps) => {
  const dispatch = useAppDispatch();

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const isInQueue = useAppSelector(state => isQueued(state, album));

  const updateAndClose = async (albumValues: AlbumCreation) => {
    try {
      const updatedAlbum = await dispatch(
        updateAlbum({ ...album, ...albumValues })
      ).unwrap();

      dispatch(addNotification({
        type: NotificationType.SUCCESS,
        title: 'Album edited successfully',
      }));

      // update in queue
      if (isInQueue) {
        dispatch(queueUpdate(updatedAlbum))
      }

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
      const removedAlbumId = await dispatch(deleteAlbum(album.id)).unwrap();

      dispatch(addNotification({
        type: NotificationType.SUCCESS,
        title: 'Album removed successfully',
      }));

      // remove from queue
      if (isInQueue) {
        dispatch(queueRemove(removedAlbumId));
      }

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
          Really remove the album <span className="italic">{album.title}
          </span> by <span className="italic">{album.artist}</span>?
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

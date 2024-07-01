import { Album, AlbumCreation } from '../../../types';
import DragDialog from '../../general/DragDialog';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import AlbumForm from './AlbumForm';
import { deleteAlbum, selectIsAloneInCategory, selectCategories, updateAlbum } from '../../../redux/reducers/albumsSlice';
import React, { useState } from 'react';
import ConfirmDialog from '../../general/ConfirmDialog';
import { selectIsQueued, queueRemove, queueUpdate } from '../../../redux/reducers/queueSlice';
import { removeFilterCategoryIfSubsetSelected } from '../../../redux/reducers/filterSlice';

interface AlbumEditDialogProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
}

const AlbumEditDialog = ({ album, isOpen, onClose }: AlbumEditDialogProps) => {
  const categories = useAppSelector(selectCategories);
  const isAloneInCategory = useAppSelector(selectIsAloneInCategory(album.category));

  const dispatch = useAppDispatch();

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const isInQueue = useAppSelector(state => selectIsQueued(state, album));

  const dispatchRemoveCategoryFromFilterIfLastOne = (category: string) => {
    // remove category of the previous album value from the
    // filter if the category no longer exists

    if (isAloneInCategory) {
      dispatch(removeFilterCategoryIfSubsetSelected({
        category, categories,
      }));
    }
  };

  const updateAndClose = async (albumValues: AlbumCreation) => {
    const oldCategory = album.category;

    const resultAction = await dispatch(updateAlbum({ ...album, ...albumValues }));
    if (updateAlbum.fulfilled.match(resultAction)) {
      // update the album if it is in the queue
      const updatedAlbum = resultAction.payload;

      if (isInQueue) {
        dispatch(queueUpdate(updatedAlbum));
      }

      if (oldCategory !== updatedAlbum.category) {
        dispatchRemoveCategoryFromFilterIfLastOne(oldCategory);
      }

      onClose();
    }
  };

  const removeAndClose = async () => {
    const oldCategory = album.category;

    const resultAction = await dispatch(deleteAlbum(album.id));
    if (deleteAlbum.fulfilled.match(resultAction)) {
      const removedAlbumId = resultAction.payload;

      if (isInQueue) {
        dispatch(queueRemove(removedAlbumId));
      }

      dispatchRemoveCategoryFromFilterIfLastOne(oldCategory);

      onClose();
    }
  };

  const deleteAndClose = async () => {
    await removeAndClose();
    closeConfirmDialog();
  };

  const closeConfirmDialog = () => { setIsRemoveOpen(false) };
  const openConfirmDialog = () => { setIsRemoveOpen(true); };

  return (
    <React.Fragment>
      <ConfirmDialog
        title='Remove album'
        isOpen={isRemoveOpen}
        onConfirm={deleteAndClose}
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
    </React.Fragment>
  );
};

export default AlbumEditDialog;

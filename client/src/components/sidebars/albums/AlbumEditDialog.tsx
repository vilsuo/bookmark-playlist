import { Album, AlbumCreation } from '../../../types';
import DragDialog from '../../general/DragDialog';
import { useAppDispatch } from '../../../redux/hooks';
import AlbumForm from './AlbumForm';
import { deleteAlbum, updateAlbum } from '../../../redux/reducers/albums/albumsSlice';
import React, { useState } from 'react';
import ConfirmDialog from '../../general/ConfirmDialog';

interface AlbumEditDialogProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
};

const AlbumEditDialog = ({ album, isOpen, onClose }: AlbumEditDialogProps) => {
  const dispatch = useAppDispatch();

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const updateAndClose = async (albumValues: AlbumCreation) => {
    const resultAction = await dispatch(updateAlbum({
      oldAlbum: album,
      newValues: albumValues
    }));

    if (updateAlbum.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  const removeAndClose = async () => {
    const resultAction = await dispatch(deleteAlbum(album));
    if (deleteAlbum.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  const closeConfirmDialog = () => { setIsRemoveOpen(false) };
  const openConfirmDialog = () => { setIsRemoveOpen(true); };

  return (
    <React.Fragment>
      <ConfirmDialog
        dataTestId="delete-confirm"
        title='Remove album'
        isOpen={isRemoveOpen}
        onConfirm={removeAndClose}
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
          submitText="Save"
        >
          <button type='button' onClick={openConfirmDialog}>Remove</button>
          <button type='button' onClick={onClose}>Cancel</button>
        </AlbumForm>
      </DragDialog>
    </React.Fragment>
  );
};

export default AlbumEditDialog;

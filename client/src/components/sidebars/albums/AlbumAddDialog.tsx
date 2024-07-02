import DragDialog from '../../general/DragDialog';
import { useAppDispatch } from '../../../redux/hooks';
import { AlbumCreation } from '../../../types';
import AlbumForm from './AlbumForm';
import { createAlbum } from '../../../redux/reducers/albums/albumsSlice';
import { CATEGORY_OTHER } from '../../../constants';

interface AlbumAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultValues = {
  artist: '',
  title: '',
  published: 2000,
  category: CATEGORY_OTHER,
  videoId: '',
};

const AlbumAddDialog = ({ isOpen, onClose }: AlbumAddDialogProps) => {
  const dispatch = useAppDispatch();

  const addAndClose = async (albumValues: AlbumCreation) => {
    const resultAction = await dispatch(createAlbum(albumValues));
    if (createAlbum.fulfilled.match(resultAction)) {
      onClose();
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

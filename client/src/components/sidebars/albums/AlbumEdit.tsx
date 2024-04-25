import { Album } from '../../../types';
import ToggleDialog from '../../general/ToggleDialog';

interface AlbumEditProps {
  album: Album;
  isOpen: boolean;
  onProceed: () => void;
  onClose: () => void;
}

const AlbumEdit = ({ album, isOpen, onProceed, onClose }: AlbumEditProps) => {
  return (
    <ToggleDialog
      title='Edit'
      isOpen={isOpen}
      onProceed={onProceed}
      onClose={onClose}
    >
      <p>{album.artist} - {album.title}</p>
    </ToggleDialog>
  );
};

export default AlbumEdit;

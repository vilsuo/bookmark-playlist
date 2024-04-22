import { Album } from '../../../types';
import DialogModal from '../../general/Dialog';

interface AlbumEditProps {
  album: Album;
  isOpen: boolean;
  close: () => void;
}

const AlbumEdit = ({ album, isOpen, close }: AlbumEditProps) => {
  return (
    <DialogModal
      title='Edit'
      isOpen={isOpen}
      onProceed={close}
      onClose={close}
    >
      <p>{album.artist} - {album.title}</p>
    </ DialogModal>
  );
};

export default AlbumEdit;

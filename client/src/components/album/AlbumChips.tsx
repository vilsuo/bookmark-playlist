import { Album } from '../../types';
import { toDateString } from '../../util/dateConverter';

interface AlbumChipsProps {
  album: Album;
}

const AlbumChips = ({ album }: AlbumChipsProps) => {
  return (
    <div className='album-chips'>
      <div className='chip'>
        Category: <span className='category'>{album.category}</span>
      </div>
      <div className='chip'>
        Added: <span className='add-date'>{toDateString(album.addDate)}</span>
      </div>
    </div>
  );
};

export default AlbumChips;

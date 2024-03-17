import { Album, Link } from '../../types';

import ma from '../../../assets/ma.ico';
import Dropdown from '../Dropdown';

const Play = ({ album, isSelected, select }: AlbumRowProps) => {

  const togglePlay = () => {
    isSelected ? select(null) : select(album);
  };

  return (
    <td className='play' onClick={togglePlay}>
      { isSelected ? 'Cancel' : 'Play' }
    </td>
  );
};

interface AlbumRowProps {
  album: Album;
  isSelected: boolean;
  select: (album: Album | null) => void;
}

const AlbumRow = ({ album, isSelected, select }: AlbumRowProps) => {

  const artistSearchString = album.artist.replace(' ', '+');
  const titleSearchString = album.title.replace(' ', '+');

  const getArtistSearchLink = (): Link => {
    const text = album.artist;
    const href = `https://www.metal-archives.com/search?searchString=${artistSearchString}&type=band_name`;
    
    return { text, href, imageSrc: ma, className: 'ma' };
  };

  const getAlbumSearchLink = (): Link => {
    const text = album.title;
    const href = `https://www.metal-archives.com/search/advanced/searching/albums?bandName=${artistSearchString}&releaseTitle=${titleSearchString}`;

    return { text, href, imageSrc: ma, className: 'ma' };
  };

  return (
    <tr>
      <Play album={album} isSelected={isSelected} select={select} />

      <td>
        <Dropdown links={[getArtistSearchLink()]}>
          {album.artist}
        </Dropdown>
      </td>

      <td>
        <Dropdown links={[
          getAlbumSearchLink(),
          { href: 'https://google.com', text: 'Edit', className: 'ma' },
        ]}>
          {album.title}
        </Dropdown>
      </td>

      <td>{album.published}</td>
    </tr>
  );
};

export default AlbumRow;

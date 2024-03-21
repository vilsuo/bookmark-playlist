import { Album } from '../../types';
import { MaLink } from '../general/Links';
import { getAlbumSearchLink, getArtistSearchLink } from '../../util/links';
import { toDateString } from '../../util/dateConverter';
import AlbumChips from './AlbumChips';

interface ExtraRowProps {
  album: Album;
  isPlaying: boolean;
  setPlayingAlbum: (album: Album | null) => void;
  close: () => void;
}

const ExtraRow = ({ album, isPlaying, setPlayingAlbum, close }: ExtraRowProps) => {
  const text = `${album.artist} - ${album.title} (${album.published})`;

  const togglePlaying = () => {
    isPlaying ? setPlayingAlbum(null) : setPlayingAlbum(album);
  };

  return (
    <tr id='extra-row'>
      <td colSpan={3}>
        <div className='extra-row-container'>
          <div className='title'>
            <span>{text}</span>
            <button onClick={close}>&#x2715;</button>
          </div>

          <AlbumChips album={album} />

          <div className='content'>
            <div className='links'>
              <MaLink link={{ text: album.artist, href: getArtistSearchLink(album) }} />
              <MaLink link={{ text: album.title, href: getAlbumSearchLink(album) }} />
            </div>

            <div className='actions'>
              <button>Queue</button>
              <button onClick={togglePlaying}>
                { isPlaying ? 'Close' : 'Open' }
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ExtraRow;

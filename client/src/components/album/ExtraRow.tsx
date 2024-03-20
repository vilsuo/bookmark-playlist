import { Album } from '../../types';

// icons
import ma from '../../../assets/ma.ico';

const getArtistSearchLink = (album: Album) => {
  const text = album.artist;

  const artistSearchString = album.artist.replace(' ', '+');
  const href = `https://www.metal-archives.com/search?searchString=${artistSearchString}&type=band_name`;
  
  return (
    <div>
      <a href={href} target='_blank'>
        <img src={ma} />
        <span>{text}</span>
      </a>
    </div>
  );
};

const getAlbumSearchLink = (album: Album) => {
  const text = album.title;

  const artistSearchString = album.artist.replace(' ', '+');
  const titleSearchString = album.title.replace(' ', '+');
  const href = `https://www.metal-archives.com/search/advanced/searching/albums?bandName=${artistSearchString}&releaseTitle=${titleSearchString}`;

  return (
    <div className='ma'>
      <a href={href} target='_blank'>
        <img src={ma} />
        <span>{text}</span>
      </a>
    </div>
  );
};

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

          <div className='chips'>
            <div className='chip'>
              Category: <span className='category'>{album.category}</span>
            </div>
          </div>

          <div className='content'>
            <div className='links'>
              { getArtistSearchLink(album) }
              { getAlbumSearchLink(album) }
            </div>

            <div className='actions'>
              <button>Queue</button>
              <button onClick={togglePlaying}>
                { isPlaying ? 'Close' : 'Open' } Video
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ExtraRow;

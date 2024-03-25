import { Album } from '../../types';

interface AlbumRowProps {
  album: Album;
  isPlaying: boolean;
  setViewingAlbum: (album: Album | null) => void;
  setPlayingAlbum: (album: Album | null) => void;
}

const AlbumRow = ({ album, isPlaying, setViewingAlbum, setPlayingAlbum }: AlbumRowProps) => {
  return (
    <tr
      className={`album-row ${isPlaying ? 'playing' : ''}`}
      onClick={() => setViewingAlbum(album)}
    >
      <td>{album.artist}</td>
      <td>{album.title}</td>
      <td className='published'>
        {album.published}
      </td>

      <td className='play'>
        <button onClick={(event) => {
          event.stopPropagation();
          setPlayingAlbum(isPlaying ? null : album);
          setViewingAlbum(null);
        }}>
          {isPlaying ? 'Close' : 'Play'}
        </button>
      </td>
    </tr>
  );
};

export default AlbumRow;

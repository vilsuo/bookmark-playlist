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
      onClick={() => {
        setPlayingAlbum(isPlaying ? null : album);
        setViewingAlbum(null);
      }}
    >
      <td className='info-row'>
        <button
          onClick={(event) => {
            event.stopPropagation();
            setViewingAlbum(album)
          }}
        >
          i
        </button>

        {album.artist}
      </td>

      <td>{album.title}</td>

      <td className='published'>
        {album.published}
      </td>
    </tr>
  );
};

export default AlbumRow;

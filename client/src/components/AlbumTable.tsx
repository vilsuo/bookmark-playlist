import { Album } from '../types';

interface AlbumProps {
  album: Album;
  className: string;
  select: (album: Album) => void;
}

const AlbumRow = ({ album, className, select }: AlbumProps) => {
  return (
    <tr className={className}
      onClick={() => select(album)}
    >
      <td>{album.artist}</td>
      <td>{album.title}</td>
      <td>{album.published}</td>
    </tr>
  );
};

interface LinkListProps {
  albums: Array<AlbumRow>;
  currentAlbum: AlbumRow | null;
  setCurrentAlbum: (link: AlbumRow) => void;
}

const AlbumTable = ({ albums, currentAlbum, setCurrentAlbum } : LinkListProps) => {

  const handleSelect = (album: Album) => {
    setCurrentAlbum(album);
    console.log('selected', album.title);
  };

  const isCurrentAlbum = (album: Album) => {
    return currentAlbum && currentAlbum.videoId === album.videoId;
  };

  return (
    <div>
      <h2>Albums</h2>

      <table className='album-table'>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Album</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) =>
            <AlbumRow
              key={album.videoId}
              album={album}
              className={isCurrentAlbum(album) ? 'selected' : ''}
              select={handleSelect}
            />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlbumTable;

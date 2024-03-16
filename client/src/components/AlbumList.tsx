import { Album } from '../types';

interface LinkListProps {
  albums: Array<Album>;
  setCurrentAlbum: (link: Album) => void;
}

const AlbumList = ({ albums, setCurrentAlbum } : LinkListProps) => {

  const handleSelect = (album: Album) => {
    setCurrentAlbum(album);
    console.log('selected', album.title);
  };

  return (
    <div>
      <h2>Links</h2>
      <ul>
      {albums.map((album) =>
        <li key={album.videoId}
          onClick={() => handleSelect(album)}
        >
          {album.title}
        </li>
      )}
      </ul>
    </div>
  );
};

export default AlbumList;

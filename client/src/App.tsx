import axios from 'axios';
import { useState } from 'react';
import FileForm from './components/FileForm';
import AlbumTable from './components/album/AlbumTable';
import Video from './components/Video';
import { Album } from './types';

const Sidebar = () => {

  return (
    <div className='sidebar'>

    </div>
  );
};

interface MainProps {
  album: Album | null;
}

const Main = ({ album }: MainProps) => {
  return (
    <div className='main'>
      { album && (
        <Video album={album} />
      )}
    </div>
  );
};

const App = () => {
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [playingAlbum, setPlayingAlbum] = useState<Album | null>(null);

  const handleUpload = async (formData: FormData) => {
    const { data } = await axios.post(
      `api/bookmark`,
      formData,
    );

    setAlbums(data);
  };

  return (
    <div>
      <FileForm upload={handleUpload} />

      { (albums.length > 0) && (
        <AlbumTable
          albums={albums}
          playingAlbum={playingAlbum}
          setPlayingAlbum={setPlayingAlbum}
        />
      )}

      <Main album={playingAlbum} />
    </div>
  );
};

export default App;

import axios from 'axios';
import { useState } from 'react';
import FileForm from './components/FileForm';
import AlbumList from './components/AlbumList';
import Video from './components/Video';
import { Album } from './types';

const App = () => {
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>();

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

      <p>Selected {currentAlbum ? currentAlbum.title : 'NONE'}</p>
      { currentAlbum && (
        <Video album={currentAlbum} />
      )}

      <AlbumList
        albums={albums}
        setCurrentAlbum={setCurrentAlbum}
      />
    </div>
  );
};

export default App;

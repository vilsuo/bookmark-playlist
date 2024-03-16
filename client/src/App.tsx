import axios from 'axios';
import { useState } from 'react';
import FileForm from './components/FileForm';
import AlbumTable from './components/AlbumTable';
import Video from './components/Video';
import { Album } from './types';

const App = () => {
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

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

      { currentAlbum && (
        <Video album={currentAlbum} />
      )}

      <AlbumTable
        albums={albums}
        currentAlbum={currentAlbum}
        setCurrentAlbum={setCurrentAlbum}
      />
    </div>
  );
};

export default App;

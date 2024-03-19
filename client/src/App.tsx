import axios from 'axios';
import { useState } from 'react';
import FileForm from './components/FileForm';
import AlbumTable from './components/album/AlbumTable';
import Video from './components/Video';
import { Album } from './types';

interface SidebarProps {
  handleUpload: (formData: FormData) => Promise<void>;

  albums: Album[];
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;

  close: () => void;
}

const Sidebar = ({ handleUpload, albums, playingAlbum, setPlayingAlbum, close }: SidebarProps) => {

  return (
    <div className='sidebar'>
      <div className='sidebar-toolbar'>
        <h2>Albums</h2>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className='sidebar-container'>
        <FileForm upload={handleUpload} />

        { (albums.length > 0) && (
          <AlbumTable
            albums={albums}
            playingAlbum={playingAlbum}
            setPlayingAlbum={setPlayingAlbum}
          />
        )}

        <ul>
          {[...Array(100).keys()].map(key => (
            <li key={key}>
              <span>item {key}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface MainProps {
  album: Album | null;
}

const Main = ({ album }: MainProps) => {
  return (
    <div className='main'>
      <h1>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z Å Ä Ö</h1>
      { album && (
        <Video album={album} />
      )}
      <ul>
        {[...Array(50).keys()].map(key => (
          <li key={key}>
            <span>item {key}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [playingAlbum, setPlayingAlbum] = useState<Album | null>(null);

  const [showSideBar, setShowSidebar] = useState(true);

  const handleUpload = async (formData: FormData) => {
    const { data } = await axios.post(
      `api/bookmark`,
      formData,
    );

    setAlbums(data);
  };

  return (
    <div className='container'>
      { showSideBar && (
        <Sidebar 
          handleUpload={handleUpload}
          albums={albums}
          playingAlbum={playingAlbum}
          setPlayingAlbum={setPlayingAlbum}
          close={() => setShowSidebar(false)}
        />
      )}

      { !showSideBar && (
        <button onClick={() => setShowSidebar(true)}>Open</button>
      )}

      <Main album={playingAlbum} />
    </div>
  );
};

export default App;

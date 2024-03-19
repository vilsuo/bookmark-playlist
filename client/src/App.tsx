import axios from 'axios';
import { useState } from 'react';
import BookmarkForm from './components/BookmarkForm';
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

// add toggle to upload form to toolbar
const Sidebar = ({ handleUpload, albums, playingAlbum, setPlayingAlbum, close }: SidebarProps) => {
  const [showUpload, setShowUpload] = useState(false);

  const toggleUpload = () => setShowUpload(!showUpload);

  return (
    <div className='sidebar'>
      <div className='sidebar-toolbar'>
        <h2>Albums</h2>
        <button onClick={toggleUpload}>Toggle upload</button>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className='sidebar-container'>
        { showUpload && (
          <BookmarkForm upload={handleUpload} />
        )}

        { (albums.length > 0) && (
          <AlbumTable
            albums={albums}
            playingAlbum={playingAlbum}
            setPlayingAlbum={setPlayingAlbum}
          />
        )}
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

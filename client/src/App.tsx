import axios from 'axios';
import { useState } from 'react';
import { Album } from './types';
import AlbumsBar from './components/sidebars/albums/Albumsbar';
import VideoPlayer from './components/video/VideoPlayer';
import AlbumsButton from './components/sidebars/albums/AlbumsButton';
import SettingsButton from './components/sidebars/settings/SettingsButton';
import SettingsBar from './components/sidebars/settings/SettingsBar';

interface MainProps {
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
}

const Main = ({ playingAlbum, setPlayingAlbum }: MainProps) => {

  const closeVideo = () => setPlayingAlbum(null);

  return (
    <div className='main'>
      { playingAlbum && (
        <VideoPlayer 
          playingAlbum={playingAlbum}
          closeVideo={closeVideo}
        />
      )}
      <ul>
        {[...Array(5).keys()].map(k => (
          <li key={k}>Item {k}</li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playingAlbum, setPlayingAlbum] = useState<Album | null>(null);

  const [showSideBar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
        <AlbumsBar 
          handleUpload={handleUpload}
          albums={albums}
          playingAlbum={playingAlbum}
          setPlayingAlbum={setPlayingAlbum}
          close={() => setShowSidebar(false)}
        />
      )}

      { showSettings && (
        <SettingsBar 
          close={() => setShowSettings(false)}
        />
      )}

      { !(showSideBar || showSettings) && (
        <div className='open-sidebar'>
          <AlbumsButton show={() => setShowSidebar(true)} />
          <SettingsButton show={() => setShowSettings(true)} />
        </div>
      )}

      <Main
        playingAlbum={playingAlbum}
        setPlayingAlbum={setPlayingAlbum}
      />
    </div>
  );
};

export default App;

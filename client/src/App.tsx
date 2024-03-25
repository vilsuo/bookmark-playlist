import { useState } from 'react';

import { Album, SidebarType,  } from './types';
import * as bookmarksService from './util/bookmarksService';
import VideoPlayer from './components/video/VideoPlayer';

// sidebars
import SidebarOpener from './components/sidebars/opener/SidebarOpener';
import Sidebar from './components/sidebars/Sidebar';

interface MainProps {
  playingAlbum: Album | null;
  setPlayingAlbum: (album: Album | null) => void;
}

const Main = ({ playingAlbum, setPlayingAlbum }: MainProps) => {
  const closeVideo = () => setPlayingAlbum(null);

  return (
    <div className="main">
      {playingAlbum && (
        <VideoPlayer album={playingAlbum} closeVideo={closeVideo} />
      )}
      <ul>
        {[...Array(5).keys()].map((k) => (
          <li key={k}>Item {k}</li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playingAlbum, setPlayingAlbum] = useState<Album | null>(null);

  // the current opened sidebar
  const [sidebar, setSidebar] = useState<SidebarType | null>(null);

  const handleUpload = async (formData: FormData) => {
    const responseData = await bookmarksService.createAlbums(formData);
    setAlbums(responseData);
  };

  return (
    <div className="container">
      { (sidebar !== null)? (
        <Sidebar 
          type={sidebar}
          setType={setSidebar}

          handleUpload={handleUpload}
          albums={albums}
          playingAlbum={playingAlbum}
          setPlayingAlbum={setPlayingAlbum}
        />
      ) : (
        <SidebarOpener 
          show={setSidebar}
        />
      )}

      <Main playingAlbum={playingAlbum} setPlayingAlbum={setPlayingAlbum} />
    </div>
  );
};

export default App;

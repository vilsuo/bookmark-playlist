import { useState } from 'react';

import { Album, SidebarType,  } from './types';
import * as bookmarksService from './util/bookmarksService';
import VideoPlayer from './components/video/VideoPlayer';

// sidebars
import SidebarOpener from './components/sidebars/opener/SidebarOpener';
import Sidebar from './components/sidebars/Sidebar';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { play, selectPlaying } from './redux/reducers/albumsSlice';

const Main = () => {
  const dispatch = useAppDispatch();
  const playingAlbum = useAppSelector(selectPlaying)

  const closeVideo = () => dispatch(play(null));

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
        />
      ) : (
        <SidebarOpener 
          show={setSidebar}
        />
      )}

      <Main />
    </div>
  );
};

export default App;

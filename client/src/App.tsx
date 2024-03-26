import { useState } from 'react';

import { Album, SidebarType,  } from './types';
import * as bookmarksService from './util/bookmarksService';
import VideoPlayer from './components/video/VideoPlayer';
import SidebarOpener from './components/sidebars/opener/SidebarOpener';
import Sidebar from './components/sidebars/Sidebar';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { play, selectPlaying } from './redux/reducers/albumsSlice';
import QueueTable from './components/queue/QueueTable';

const Main = () => {
  const dispatch = useAppDispatch();

  // playing
  const playingAlbum = useAppSelector(selectPlaying)
  const closeVideo = () => dispatch(play(null));

  return (
    <div className="main">
      {playingAlbum && (
        <VideoPlayer album={playingAlbum} closeVideo={closeVideo} />
      )}

      <div>
        <QueueTable />
      </div>
    </div>
  );
};

const App = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  // the current opened sidebar
  const [sidebarType, setSidebarType] = useState<SidebarType | null>(null);

  const closeSidebar = () => setSidebarType(null);

  const handleUpload = async (formData: FormData) => {
    const responseData = await bookmarksService.createAlbums(formData);
    setAlbums(responseData);
  };

  return (
    <div className="container">
      { (sidebarType !== null) ? (
        <Sidebar 
          type={sidebarType}
          close={closeSidebar}
          upload={handleUpload}
          albums={albums}
        />
      ) : (
        <SidebarOpener 
          show={setSidebarType}
        />
      )}

      <Main />
    </div>
  );
};

export default App;

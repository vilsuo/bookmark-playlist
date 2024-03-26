import { useState } from 'react';

import { Album, SidebarType,  } from './types';
import * as bookmarksService from './util/bookmarksService';
import VideoPlayer from './components/video/VideoPlayer';
import SidebarOpener from './components/sidebars/opener/SidebarOpener';
import Sidebar from './components/sidebars/Sidebar';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { play, removeQueue, selectPlaying, selectQueue } from './redux/reducers/albumsSlice';

const QueueTable = () => {
  const dispatch = useAppDispatch();

  // queue
  const queue = useAppSelector(selectQueue);
  const remove = (album: Album) => dispatch(removeQueue(album));

  return (
    <table>
      <thead>
        <tr>
          <th>Entry</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {queue.map((album) => (
          <tr key={album.videoId}>
            <td>
              {album.artist} - {album.title} {`(${album.published})`}
            </td>
            <td>
              <button onClick={() => remove(album)}>&#x2715;</button>
              <button>&#x2B06;</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

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

      <QueueTable />
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

import axios from 'axios';
import { useState } from 'react';
import Video from './components/Video';
import { Album } from './types';
import Sidebar from './components/Sidebar';

const formatVideoTitle = (album: Album) => {
  const { artist, title, published } = album;

  return `${artist} - ${title} (${published})`;
};

interface VideoPlayerProps {
  playingAlbum: Album;
  closeVideo: () => void;
}

const VideoPlayer = ({ playingAlbum, closeVideo }: VideoPlayerProps) => {
  return (
    <div className='video-player'>
      <div className='header'>
        <h1>{formatVideoTitle(playingAlbum)}</h1>
        <button onClick={closeVideo}>Close</button>
      </div>
      
      <Video videoId={playingAlbum.videoId} />
    </div>
  );
};

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
    </div>
  );
};

const App = () => {
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [playingAlbum, setPlayingAlbum] = useState<Album | null>(null);

  const [showSideBar, setShowSidebar] = useState(false);

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

      <Main
        playingAlbum={playingAlbum}
        setPlayingAlbum={setPlayingAlbum}
      />
    </div>
  );
};

export default App;

import { Album } from '../../types';
import VideoPlayer from './VideoPlayer';
import VideoDetails from './VideoDetails';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShowVideoDetails } from '../../redux/reducers/settingsSlice';
import { setPlayingAlbum, selectPlaying } from '../../redux/reducers/albums/albumsSlice';
import { playNext } from '../../redux/reducers/albums/playing';

const formatVideoTitle = (album: Album) => {
  const { artist, title, published } = album;
  return `${artist} - ${title} (${published})`;
};

const VideoContainer = () => {
  const playingAlbum = useAppSelector(selectPlaying);
  const showVideoDetails = useAppSelector(selectShowVideoDetails);

  const dispatch = useAppDispatch();

  if (!playingAlbum) { return null; }

  return (
    <div className="video-container">
      <div className="header">
        <h1>{formatVideoTitle(playingAlbum)}</h1>
      </div>

      <VideoPlayer
        videoId={playingAlbum.videoId}
        playNext={() => { dispatch(playNext()); }}
        close={() => { dispatch(setPlayingAlbum(null)); } }
      />

      { showVideoDetails && <VideoDetails album={playingAlbum} /> }
    </div>
  );
};

export default VideoContainer;

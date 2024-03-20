import { Album } from '../types';

interface VideoProps {
  album: Album;
}

const Video = ({ album }: VideoProps) => {
  const { videoId } = album;
  
  return (
    <div className='video'>
      <iframe src={`https://www.youtube.com/embed/${videoId}`} />
    </div>
  );
};

export default Video;

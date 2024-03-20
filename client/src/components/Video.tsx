interface VideoProps {
  videoId: string;
}

const Video = ({ videoId }: VideoProps) => {
  
  return (
    <div className='video'>
      <iframe src={`https://www.youtube.com/embed/${videoId}`} />
    </div>
  );
};

export default Video;

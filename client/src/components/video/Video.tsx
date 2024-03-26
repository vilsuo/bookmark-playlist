import { useAppSelector } from '../../redux/hooks';
import { selectAutoplay } from '../../redux/reducers/settingsSlice';

interface VideoProps {
  videoId: string;
}

const Video = ({ videoId }: VideoProps) => {
  const autoPlay = useAppSelector(selectAutoplay);

  return (
    <div className="video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${+autoPlay}`}
      />
    </div>
  );
};

export default Video;

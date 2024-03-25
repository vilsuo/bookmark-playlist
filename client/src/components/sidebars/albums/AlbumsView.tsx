import { Album } from '../../../types';

interface AlbumsViewProps {
  album: Album;
  close: () => void;
  play: () => void;
}

const AlbumsView = ({ album, close, play }: AlbumsViewProps) => {

  const text = `${album.artist} - ${album.title} (${album.published})`;

  return (
    <div className="albums-view">
      <div className="extra-row-container">
        <div className="title">
        <span>{text}</span>
        <button onClick={close}>&#x2715;</button>
      </div>

        <div className="actions">
          <button>Queue</button>
          <button onClick={play}>Play</button>
        </div>
      </div>
    </div>
  );
};

export default AlbumsView;

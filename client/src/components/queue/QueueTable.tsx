import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setPlayingAlbum } from '../../redux/reducers/albums/albumsSlice';
import { queuePrepend, queueRemove, selectQueue } from '../../redux/reducers/queueSlice';
import { Album, AlbumColumn } from '../../types';

interface QueueActionsProps {
  album: Album;
};

const QueueActions = ({ album }: QueueActionsProps) => {
  const dispatch = useAppDispatch();

  const playAndRemoveFromQueue = (album: Album) => {
    dispatch(setPlayingAlbum(album));
    removeFromQueue(album);
  };

  const removeFromQueue = (album: Album) => dispatch(queueRemove(album.id));

  return (
    <div className="queue-actions">
      <button data-testid="play-queue" onClick={() => playAndRemoveFromQueue(album)}>
        &#x25B6;
      </button>
      <button data-testid="prepend-queue" onClick={() => dispatch(queuePrepend(album))}>
        &#x2B06;
      </button>
      <button data-testid="remove-queue" onClick={() => removeFromQueue(album)}>
        &#x2715;
      </button>
    </div>
  );
};

const QueueTable = () => {
  const queue = useAppSelector(selectQueue);

  if (queue.length === 0) {
    return null;
  }

  return (
    <div>
      <table className="queue-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{AlbumColumn.ARTIST}</th>
            <th>{AlbumColumn.ALBUM}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="queue-tbody">
          {queue.map((album, idx) => (
            <tr className="queue-row" key={album.videoId}>
              <td>
                {idx + 1}
              </td>
              <td>
                {album.artist}
              </td>
              <td>
                {album.title}
              </td>
              <td>
                <QueueActions album={album} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueueTable;

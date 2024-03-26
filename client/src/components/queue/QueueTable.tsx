import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { play } from '../../redux/reducers/albumsSlice';
import { queuePrepend, queueRemove, selectQueue } from '../../redux/reducers/queueSlice';
import { Album } from '../../types';

const QueueTable = () => {
  const dispatch = useAppDispatch();
  const queue = useAppSelector(selectQueue);

  const playAndRemoveFromQueue = (album: Album) => {
    dispatch(play(album));
    removeFromQueue(album);
  };

  const removeFromQueue = (album: Album) => dispatch(queueRemove(album));

  if (queue.length === 0) {
    return null;
  }

  return (
    <table className="queue-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
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
            <td onClick={(event) => event.stopPropagation()}>
              <div className="actions">
                <button onClick={() => playAndRemoveFromQueue(album)}>
                  &#x25B6;
                </button>
                <button onClick={() => dispatch(queuePrepend(album))}>
                  &#x2B06;
                </button>
                <button onClick={() => removeFromQueue(album)}>
                  &#x2715;
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QueueTable;

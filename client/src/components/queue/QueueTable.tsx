import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { removeQueue, selectQueue } from '../../redux/reducers/albumsSlice';
import { Album } from '../../types';

const QueueTable = () => {
  const dispatch = useAppDispatch();

  // queue
  const queue = useAppSelector(selectQueue);
  const remove = (album: Album) => dispatch(removeQueue(album));

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
          <tr className="queue-row "key={album.videoId}>
            <td>{idx + 1}</td>
            <td>
              {album.artist}
            </td>
            <td>
              {album.title}
            </td>
            <td>
              <div className="actions">
                <button onClick={() => remove(album)}>&#x2715;</button>
                <button>&#x2B06;</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QueueTable;

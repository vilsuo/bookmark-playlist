import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { removeQueue, selectQueue } from '../../redux/reducers/albumsSlice';
import { Album } from '../../types';

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

export default QueueTable;

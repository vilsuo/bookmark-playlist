import { AlbumColumn } from '../../../../types';
import AlbumRow from './AlbumRow';
import SortableColumn from '../../../general/SortableColumn';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectSorting, setSort } from '../../../../redux/reducers/filters/filterSlice';
import { selectSortedAndFilteredAlbums } from '../../../../redux/reducers/albums/filterSort';

const AlbumTable = () => {
  const filteredAndSortedAlbums = useAppSelector(selectSortedAndFilteredAlbums);
  const { column, order } = useAppSelector(selectSorting);

  const dispatch = useAppDispatch();

  const handleSortChange = (column: AlbumColumn) => {
    dispatch(setSort(column));
  };

  return (
    <table className="album-table">
      <thead>
        <tr>
          {[AlbumColumn.ARTIST, AlbumColumn.ALBUM, AlbumColumn.PUBLISHED, AlbumColumn.ADD_DATE].map(
            (col) => (
              <SortableColumn
                key={col}
                value={col}
                setValue={handleSortChange}
                sortColumn={column}
                sortOrder={order}
              />
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {filteredAndSortedAlbums.map((album) =>
          <AlbumRow
            key={album.videoId}
            album={album}
          />
        )}
      </tbody>
    </table>
  );
};

export default AlbumTable;

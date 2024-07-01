import { AlbumColumn } from '../../../../types';
import AlbumRow from './AlbumRow';
import SortableColumn from '../../../general/SortableColumn';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectFilters, setSort } from '../../../../redux/reducers/filterSlice';
import { selectSortedAndFilteredAlbums } from '../../../../redux/reducers/albumsSlice';

const AlbumTable = () => {
  const filteredAndSortedAlbums = useAppSelector(selectSortedAndFilteredAlbums);
  const filterState = useAppSelector(selectFilters);

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
                sortColumn={filterState.sortColumn}
                sortOrder={filterState.sortOrder}
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

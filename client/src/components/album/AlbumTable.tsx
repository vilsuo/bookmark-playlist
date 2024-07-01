import { Album, AlbumColumn } from '../../types';
import AlbumRow from './AlbumRow';
import SortableColumn from '../general/SortableColumn';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectFilters, setSort } from '../../redux/reducers/filterSlice';
import { selectSortedAndFilteredAlbums } from '../../redux/reducers/albumsSlice';

interface AlbumTableProps {
  viewingAlbum: Album | null;
  setViewingAlbum: (album: Album | null) => void;
}

const AlbumTable = ({
  viewingAlbum,
  setViewingAlbum,
}: AlbumTableProps) => {
  const filteredAndSortedAlbums = useAppSelector(selectSortedAndFilteredAlbums);
  const filterState = useAppSelector(selectFilters);

  const dispatch = useAppDispatch();

  const isViewing = (album: Album) => {
    return viewingAlbum !== null && viewingAlbum.videoId === album.videoId;
  };

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
            isViewed={isViewing(album)}
            view={setViewingAlbum}
          />
        )}
      </tbody>
    </table>
  );
};

export default AlbumTable;

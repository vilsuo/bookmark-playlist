import { Album, AlbumColumn } from '../../types';
import AlbumRow from './AlbumRow';
import SortableColumn from '../general/SortableColumn';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectFilters, setSort } from '../../redux/reducers/filterSlice';

interface AlbumTableProps {
  albums: Album[];
  playingAlbum: Album | null;
  viewingAlbum: Album | null;
  setViewingAlbum: (album: Album | null) => void;
}

const AlbumTable = ({
  albums,
  playingAlbum,
  viewingAlbum,
  setViewingAlbum,
}: AlbumTableProps) => {
  const filterState = useAppSelector(selectFilters);

  const dispatch = useAppDispatch();

  const isPlaying = (album: Album) => {
    return playingAlbum !== null && playingAlbum.videoId === album.videoId;
  };

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
        {albums.map((album) =>
          <AlbumRow
            key={album.videoId}
            album={album}
            isPlayed={isPlaying(album)}
            isViewed={isViewing(album)}
            view={setViewingAlbum}
          />
        )}
      </tbody>
    </table>
  );
};

export default AlbumTable;

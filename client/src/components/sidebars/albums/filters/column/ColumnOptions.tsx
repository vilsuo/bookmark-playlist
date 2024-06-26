import { AlbumColumn } from "../../../../../types";

interface ColumnOptionsProps {
  column: AlbumColumn;
  handleColumnChange: (column: AlbumColumn) => void;
};

const ColumnOptions = ({ column, handleColumnChange }: ColumnOptionsProps) => {
  return (
    <div className="filter-column">
      <label htmlFor="album-filter-column">Filter albums:</label>
      <select
        id="album-filter-column"
        value={column}
        onChange={({ target }) =>
          handleColumnChange(target.value as AlbumColumn)
        }
      >
        <option value={AlbumColumn.ARTIST}>{AlbumColumn.ARTIST}</option>
        <option value={AlbumColumn.ALBUM}>{AlbumColumn.ALBUM}</option>
        <option value={AlbumColumn.PUBLISHED}>{AlbumColumn.PUBLISHED}</option>
        <option value={AlbumColumn.ADD_DATE}>{AlbumColumn.ADD_DATE}</option>
      </select>
    </div>
  );
};

export default ColumnOptions;

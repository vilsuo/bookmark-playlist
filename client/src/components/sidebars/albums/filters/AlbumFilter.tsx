import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  resetFilters,
  setFilterColumn,
  selectFilters,
} from '../../../../redux/reducers/filterSlice';
import { AlbumColumn } from '../../../../types';
import FilterCategory from './FilterCategory';
import FilterColumnInputs from './FilterColumnInputs';

const AlbumFilter = () => {
  const dispatch = useAppDispatch();

  const { column } = useAppSelector(selectFilters);

  const handleColumnChange = (value: AlbumColumn) => {
    dispatch(setFilterColumn(value));
  };

  const handleFilterReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="album-filter">
      <div className="filter-column-container">
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

        <FilterColumnInputs column={column} />

        <button onClick={handleFilterReset}>
          Clear
        </button>
      </div>

      <FilterCategory />
    </div>
  );
};

export default AlbumFilter;

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectFilterColumn, selectFilters, setFilterInterval, setFilterText } from '../../redux/reducers/filterSlice';
import { AlbumColumn } from '../../types';

/*
const printInterval = (int: Interval) => {
  const { start, end } = int;
  return '["' + Number(start) + '", "' + Number(end) + '"]';
};
*/

const AlbumFilter = () => {
  const dispatch = useAppDispatch();

  const { text, column, interval } = useAppSelector(selectFilters);

  const handleColumnChange = (value: AlbumColumn) => {
    dispatch(selectFilterColumn(value));
  };

  const handleTextChange = (value: string) => {
    dispatch(setFilterText(value));
  };

  const handleStartChange = (value: string) => {
    dispatch(setFilterInterval({ ...interval, start: value }));
  };

  const handleEndChange = (value: string) => {
    dispatch(setFilterInterval({ ...interval, end: value }));
  };

  return (
    <div className='album-filter'>
      {/*
      <div>
        <p>Column {column}</p>
        <p>Text: "{text}"</p>
        <p>Interval: {printInterval(interval)}</p>
        <br />
      </div>
      */}
      <div className='filter-column'>
        <label htmlFor='album-filter-column'>Filter by:</label>
        <select
          id='album-filter-column'
          value={column}
          onChange={({ target }) => handleColumnChange(target.value as AlbumColumn)}
        >
          <option value={AlbumColumn.ARTIST}>
            {AlbumColumn.ARTIST}
          </option>
          <option value={AlbumColumn.ALBUM}>
            {AlbumColumn.ALBUM}
          </option>
          <option value={AlbumColumn.PUBLISHED}>
            {AlbumColumn.PUBLISHED}
          </option>
        </select>
      </div>

    { column !== AlbumColumn.PUBLISHED ? (
      <div className='filter-text'>
        <label htmlFor='album-filter-text'>Search:</label>
        <input
          id='album-filter-text'
          type='text'
          value={text}
          onChange={({ target }) => handleTextChange(target.value)}
        />
      </div>
    ) : (
      <div className='filter-interval'>
        <div>
          <label htmlFor='album-filter-start'>From:</label>
          <input
            id='album-filter-start'
            type='text'
            value={interval.start}
            onChange={({ target }) => handleStartChange(target.value)}
          />
        </div>

        <div>
          <label htmlFor='album-filter-end'>to:</label>
          <input
            id='album-filter-end'
            type='text'
            value={interval.end}
            onChange={({ target }) => handleEndChange(target.value)}
          />
        </div>
      </div>
    )}
    </div>
  );
};

export default AlbumFilter;

import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { selectFilters, setFilterAddDateInterval, setFilterPublishInterval, setFilterText } from "../../../../../redux/reducers/filterSlice";
import { AlbumColumn } from "../../../../../types";

interface FilterColumnInputsProps {
  column: AlbumColumn;
}

const FilterColumnInputs = ({ column }: FilterColumnInputsProps) => {
  const dispatch = useAppDispatch();
  const { text, publishInterval, addDateInterval } = useAppSelector(selectFilters);

  const handleTextChange = (value: string) => {
    dispatch(setFilterText(value));
  };

  const handlePublishStartChange = (value: string) => {
    dispatch(setFilterPublishInterval({ ...publishInterval, start: value }));
  };

  const handlePublishEndChange = (value: string) => {
    dispatch(setFilterPublishInterval({ ...publishInterval, end: value }));
  };

  const handleAddDateStartChange = (value: string) => {
    dispatch(setFilterAddDateInterval({ ...addDateInterval, start: value }));
  };

  const handleAddDateEndChange = (value: string) => {
    dispatch(setFilterAddDateInterval({ ...addDateInterval, end: value }));
  };

  switch (column) {
    case AlbumColumn.ALBUM:
    case AlbumColumn.ARTIST:
      return (
        <div className="filter-text">
          <label htmlFor="album-artist-text">Search:</label>
          <input
            id="album-artist-text"
            type="text"
            value={text}
            onChange={({ target }) => handleTextChange(target.value)}
          />
        </div>
      );
    
    case AlbumColumn.PUBLISHED:
      return (
        <div className="filter-interval">
          <div className="start">
            <label htmlFor="publish-start">From:</label>
            <input
              id="publish-start"
              type="number"
              value={publishInterval.start}
              onChange={({ target }) => handlePublishStartChange(target.value)}
            />
          </div>

          <div>
            <label htmlFor="publish-end">to:</label>
            <input
              id="publish-end"
              type="number"
              value={publishInterval.end}
              onChange={({ target }) => handlePublishEndChange(target.value)}
            />
          </div>
        </div>
      );

    case AlbumColumn.ADD_DATE:
      return (
        <div className="filter-interval">
          <div className="start">
            <label htmlFor="addDate-start">From:</label>
            <input
              id="addDate-start"
              type="date"
              value={addDateInterval.start}
              onChange={({ target }) => handleAddDateStartChange(target.value)}
            />
          </div>

          <div>
            <label htmlFor="addDate-end">to:</label>
            <input
              id="addDate-end"
              type="date"
              value={addDateInterval.end}
              onChange={({ target }) => handleAddDateEndChange(target.value)}
            />
          </div>
        </div>
      );

    default:
      column satisfies never;
  }
};

export default FilterColumnInputs;

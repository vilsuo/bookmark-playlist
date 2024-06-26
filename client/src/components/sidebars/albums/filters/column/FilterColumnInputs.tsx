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
    const newStart = value !== "" ? Number(value) : undefined;
    dispatch(setFilterPublishInterval({ ...publishInterval, start: newStart }));
  };

  const handlePublishEndChange = (value: string) => {
    const newEnd = value !== "" ? Number(value) : undefined;
    dispatch(setFilterPublishInterval({ ...publishInterval, end: newEnd }));
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
          <label htmlFor="album-filter-text">Search:</label>
          <input
            id="album-filter-text"
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
            <label htmlFor="album-filter-publish-start">From:</label>
            <input
              id="album-filter-publish-start"
              type="number"
              value={publishInterval.start !== undefined ? publishInterval.start : ""}
              onChange={({ target }) => handlePublishStartChange(target.value)}
            />
          </div>

          <div>
            <label htmlFor="album-filter-publish-end">to:</label>
            <input
              id="album-filter-publish-end"
              type="number"
              value={publishInterval.end !== undefined ? publishInterval.end : ""}
              onChange={({ target }) => handlePublishEndChange(target.value)}
            />
          </div>
        </div>
      );

    case AlbumColumn.ADD_DATE:
      return (
        <div className="filter-interval">
          <div className="start">
            <label htmlFor="album-filter-addDate-start">From:</label>
            <input
              id="album-filter-addDate-start"
              type="date"
              value={addDateInterval.start}
              onChange={({ target }) => handleAddDateStartChange(target.value)}
            />
          </div>

          <div>
            <label htmlFor="album-filter-addDate-end">to:</label>
            <input
              id="album-filter-addDate-end"
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

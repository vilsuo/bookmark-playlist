import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { FilterInterval, selectFilters, setFilteringAddDate, setFilteringPublished, setFilteringText } from "../../../../../redux/reducers/filters/filterSlice";
import { AlbumColumn } from "../../../../../types";

const TextInput = ({ text }: { text: string}) => {
  const dispatch = useAppDispatch();

  const handleTextChange = (value: string) => {
    dispatch(setFilteringText(value));
  };

  return (
    <div className="filter-text">
      <label htmlFor="album-artist-text">Search</label>
      <input
        id="album-artist-text"
        type="text"
        value={text}
        onChange={({ target }) => handleTextChange(target.value)}
      />
    </div>
  );
};

const PublishInput = ({ interval }: { interval: FilterInterval }) => {
  const dispatch = useAppDispatch();

  const handlePublishStartChange = (value: string) => {
    dispatch(setFilteringPublished({ ...interval, start: value }));
  };

  const handlePublishEndChange = (value: string) => {
    dispatch(setFilteringPublished({ ...interval, end: value }));
  };

  return (
    <div className="filter-interval publish">
      <div className="start">
        <label htmlFor="publish-start">From</label>
        <input
          id="publish-start"
          type="number"
          value={interval.start}
          onChange={({ target }) => handlePublishStartChange(target.value)}
        />
      </div>
      
      <div className="end">
        <label htmlFor="publish-end">To</label>
        <input
          id="publish-end"
          type="number"
          value={interval.end}
          onChange={({ target }) => handlePublishEndChange(target.value)}
        />
      </div>
    </div>
  );
};

const AddDateInput = ({ interval }: { interval: FilterInterval }) => {
  const dispatch = useAppDispatch();

  const handleAddDateStartChange = (value: string) => {
    dispatch(setFilteringAddDate({ ...interval, start: value }));
  };

  const handleAddDateEndChange = (value: string) => {
    dispatch(setFilteringAddDate({ ...interval, end: value }));
  };

  return (
    <div className="filter-interval add-date">
      <div className="start">
        <label htmlFor="addDate-start">From</label>
        <input
          id="addDate-start"
          type="date"
          value={interval.start}
          onChange={({ target }) => handleAddDateStartChange(target.value)}
        />
      </div>
      
      <div className="end">
        <label htmlFor="addDate-end">To</label>
        <input
          id="addDate-end"
          type="date"
          value={interval.end}
          onChange={({ target }) => handleAddDateEndChange(target.value)}
        />
      </div>
    </div>
  );
};

interface FilterColumnInputsProps {
  column: AlbumColumn;
};

const FilterColumnInputs = ({ column }: FilterColumnInputsProps) => {
  const { text, published, addDate } = useAppSelector(selectFilters);

  switch (column) {
    case AlbumColumn.ALBUM:
    case AlbumColumn.ARTIST:
      return <TextInput text={text} />

    case AlbumColumn.PUBLISHED:
      return <PublishInput interval={published} />

    case AlbumColumn.ADD_DATE:
      return <AddDateInput interval={addDate} />;

    default:
      column satisfies never;
  }
};

export default FilterColumnInputs;

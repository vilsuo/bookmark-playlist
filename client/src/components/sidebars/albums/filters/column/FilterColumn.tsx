import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { resetFilteringFields, selectFilters, setFilteringColumn } from "../../../../../redux/reducers/filterSlice";
import { AlbumColumn } from "../../../../../types";
import ColumnOptions from "./ColumnOptions";
import FilterColumnInputs from "./FilterColumnInputs";

const FilterColumn = () => {
  const dispatch = useAppDispatch();

  const { column } = useAppSelector(selectFilters);

  const handleColumnChange = (value: AlbumColumn) => {
    dispatch(setFilteringColumn(value));
  };

  const handleFilterReset = () => {
    dispatch(resetFilteringFields());
  };

  return (
    <div className="filter-column">
      <ColumnOptions
        column={column}
        handleColumnChange={handleColumnChange}
      />

      <FilterColumnInputs column={column} />

      <button onClick={handleFilterReset}>
        Clear
      </button>
    </div>
  );
};

export default FilterColumn;

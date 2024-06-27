import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { resetColumnFilters, selectFilters, setFilterColumn } from "../../../../../redux/reducers/filterSlice";
import { AlbumColumn } from "../../../../../types";
import ColumnOptions from "./ColumnOptions";
import FilterColumnInputs from "./FilterColumnInputs";

const FilterColumn = () => {
  const dispatch = useAppDispatch();

  const { column } = useAppSelector(selectFilters);

  const handleColumnChange = (value: AlbumColumn) => {
    dispatch(setFilterColumn(value));
  };

  const handleFilterReset = () => {
    dispatch(resetColumnFilters());
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

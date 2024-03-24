import { Order } from '../../types';

const getSortClassName = <T extends string>(
  value: T,
  sortColumn: T,
  sortOrder: Order,
) => {
  if (sortColumn === value) {
    return sortOrder === Order.ASC ? 'asc' : 'desc';
  }
  return undefined;
};

interface SortableColumnProps<T> {
  value: T;
  setValue: (t: T) => void;
  sortColumn: T;
  sortOrder: Order;
}

const SortableColumn = <T extends string>({
  value,
  setValue,
  sortColumn,
  sortOrder,
}: SortableColumnProps<T>) => {
  return (
    <th className="sortable" onClick={() => setValue(value)}>
      {value}
      <div
        className={`sortable-icon ${getSortClassName(value, sortColumn, sortOrder)}`}
      />
    </th>
  );
};

export default SortableColumn;

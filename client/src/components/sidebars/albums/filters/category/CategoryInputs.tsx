import { CATEGORY_ALL } from "../../../../../constants";
import { useAppDispatch } from "../../../../../redux/hooks";
import { toggleFilterCategory } from "../../../../../redux/reducers/filterSlice";

interface CategoryInputsProps {
  categories: string[];
  isAllSelected: boolean;
  isSelected: (category: string) => boolean;
};

const CategoryInputs = ({ categories, isAllSelected, isSelected }: CategoryInputsProps) => {
  const dispatch = useAppDispatch();

  const handleToggleAll = () => {
    dispatch(toggleFilterCategory({ category: CATEGORY_ALL, categories }));
  };

  const handleToggleSingle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    dispatch(toggleFilterCategory({ category: value, categories }));
  };

  return (
    <div className="category-filter">
      <label className="all">
        <span>{CATEGORY_ALL}</span>
        <input type="checkbox"
          value={categories}
          checked={isAllSelected}
          onChange={handleToggleAll}
        />
      </label>

      { categories.map(category => 
        <label key={category}>
          <span>{category}</span>
          <input type="checkbox"
            value={category}
            checked={ isSelected(category) }
            onChange={handleToggleSingle}
          />
        </label>
      )}
    </div>
  );
};

export default CategoryInputs;

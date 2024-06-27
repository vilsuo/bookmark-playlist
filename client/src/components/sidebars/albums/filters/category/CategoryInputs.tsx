import { CATEGORY_ALL } from "../../../../../constants";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { selectCategories } from "../../../../../redux/reducers/albumsSlice";
import { selectIsCategoryFiltered, toggleFilterCategorySingle, toggleFilterCategoryAll, selectIsAllCategoriesFiltered } from "../../../../../redux/reducers/filterSlice";

interface CategoryInputAllProps {
  isAllFiltered: boolean;
};

const CategoryInputAll = ({ isAllFiltered }: CategoryInputAllProps) => {
  const dispatch = useAppDispatch();

  const handleToggleAll = () => {
    dispatch(toggleFilterCategoryAll());
  };

  return (
    <label>
      <span>{CATEGORY_ALL}</span>
      <input type="checkbox"
        value={CATEGORY_ALL}
        checked={isAllFiltered}
        onChange={handleToggleAll}
      />
    </label>
  );
};

interface CategoryInputSinleProps {
  category: string;
  isAllFiltered: boolean;
};

const CategoryInputSingle = ({ category, isAllFiltered }: CategoryInputSinleProps) => {
  const isCategoryFiltered = useAppSelector((state) => selectIsCategoryFiltered(state, category));

  const dispatch = useAppDispatch();

  const handleToggleSingle = () => {
    dispatch(toggleFilterCategorySingle(category));
  };

  return (
    <label>
      <span>{category}</span>
      <input type="checkbox"
        value={category}
        checked={isAllFiltered || isCategoryFiltered}
        onChange={handleToggleSingle}
      />
    </label>
  );
};

const CategoryInputs = () => {
  const allCategories = useAppSelector(selectCategories);
  const isAllCategoriesFiltered = useAppSelector(selectIsAllCategoriesFiltered);

  return (
    <div className="category-inputs">
      <CategoryInputAll isAllFiltered={isAllCategoriesFiltered} />

      { allCategories.map(category => 
        <CategoryInputSingle key={category}
          category={category}
          isAllFiltered={isAllCategoriesFiltered}
        />
      )}
    </div>
  );
};

export default CategoryInputs;

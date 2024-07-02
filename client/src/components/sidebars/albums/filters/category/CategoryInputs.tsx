import { CATEGORY_ALL } from "../../../../../constants";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { selectAlbumCategories } from "../../../../../redux/reducers/albums/albumsSlice";
import { selectIsCategoryFiltered, toggleFilterCategorySingle, toggleFilteringCategoryAll, selectIsAllCategoriesFiltered } from "../../../../../redux/reducers/filters/filterSlice";

interface CategoryInputAllProps {
  isAllSelected: boolean;
};

const CategoryInputAll = ({ isAllSelected }: CategoryInputAllProps) => {
  const dispatch = useAppDispatch();

  const handleToggleAll = () => {
    dispatch(toggleFilteringCategoryAll());
  };

  return (
    <label>
      <span>{CATEGORY_ALL}</span>
      <input type="checkbox"
        value={CATEGORY_ALL}
        checked={isAllSelected}
        onChange={handleToggleAll}
      />
    </label>
  );
};

interface CategoryInputSinleProps {
  category: string;
  isAllSelected: boolean;
};

const CategoryInputSingle = ({ category, isAllSelected }: CategoryInputSinleProps) => {
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
        checked={isAllSelected || isCategoryFiltered}
        onChange={handleToggleSingle}
      />
    </label>
  );
};

const CategoryInputs = () => {
  const albumCategories = useAppSelector(selectAlbumCategories);
  const isAllCategoriesFiltered = useAppSelector(selectIsAllCategoriesFiltered);

  return (
    <div className="category-inputs">
      <CategoryInputAll isAllSelected={isAllCategoriesFiltered} />

      { albumCategories.map(category => 
        <CategoryInputSingle key={category}
          category={category}
          isAllSelected={isAllCategoriesFiltered}
        />
      )}
    </div>
  );
};

export default CategoryInputs;

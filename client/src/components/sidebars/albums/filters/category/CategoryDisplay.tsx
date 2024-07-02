import { useAppSelector } from "../../../../../redux/hooks";
import { selectFilterCategories, selectIsAllCategoriesFiltered } from "../../../../../redux/reducers/filters/filterSlice";

interface CategoryDisplayProps {
  showList: boolean;
  setShowList: (show: boolean) => void;
};

const CategoryDisplay = ({ showList, setShowList }: CategoryDisplayProps) => {
  const filterCategories = useAppSelector(selectFilterCategories);
  const isAllCategoriesFiltered = useAppSelector(selectIsAllCategoriesFiltered);

  return (
    <div className="category-display">
      <div className="selected">
        Categories:
        { isAllCategoriesFiltered
          ? <span>{filterCategories}</span>

          : (filterCategories as string[]).map(category =>
            <span key={category}>
              {category}
            </span>
          )}
      </div>

      <button onClick={() => setShowList(!showList)}>
        { !showList ? "Change" : "Close" }
      </button>
    </div>
  );
};

export default CategoryDisplay;

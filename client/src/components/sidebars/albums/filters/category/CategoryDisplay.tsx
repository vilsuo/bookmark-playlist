import { CATEGORY_ALL } from "../../../../../constants";
import { useAppSelector } from "../../../../../redux/hooks";
import { selectFilterCategories } from "../../../../../redux/reducers/filterSlice";

interface CategoryDisplayProps {
  showList: boolean;
  setShowList: (show: boolean) => void;
};

const CategoryDisplay = ({ showList, setShowList }: CategoryDisplayProps) => {
  const filterCategories = useAppSelector(selectFilterCategories);

  const isAllSelected = filterCategories === CATEGORY_ALL;

  return (
    <div className="category-display">
      <div className="selected">
        Categories:
        { isAllSelected
          ? <span>{filterCategories}</span>

          : filterCategories.map(category =>
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

import { CATEGORY_ALL } from "../../../../../constants";
import { FilterState } from "../../../../../redux/reducers/filterSlice";

interface CategoryDisplayProps {
  selectedCategories: FilterState["categories"];
  showList: boolean;
  setShowList: (show: boolean) => void;
};

const CategoryDisplay = ({ selectedCategories, showList, setShowList }: CategoryDisplayProps) => {
  return (
    <div className="category-display">
      <div className="selected">
        Categories:
        { (selectedCategories !== CATEGORY_ALL)
          ? selectedCategories.map(
            category => <span key={category}>{category}</span>
          )
          : <span>{selectedCategories}</span>
        }
      </div>

      <button onClick={() => setShowList(!showList)}>
        { !showList ? "Change" : "Close" }
      </button>
    </div>
  );
};

export default CategoryDisplay;

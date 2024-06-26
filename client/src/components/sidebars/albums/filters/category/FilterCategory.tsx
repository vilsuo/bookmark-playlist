import { useState } from "react";
import { useAppSelector } from "../../../../../redux/hooks";
import { selectCategories } from "../../../../../redux/reducers/albumsSlice";
import { selectFilterCategories } from "../../../../../redux/reducers/filterSlice";
import { CATEGORY_ALL } from "../../../../../constants";
import { Album } from "../../../../../types";
import CategoryDisplay from "./CategoryDisplay";
import CategoryInputs from "./CategoryInputs";

const FilterCategory = () => {
  const allCategories = useAppSelector(selectCategories);
  const selectedCategories = useAppSelector(selectFilterCategories);

  const [showList, setShowList] = useState(false);

  const isAllSelected = selectedCategories === CATEGORY_ALL;

  const isSelected = (category: Album["category"]) => {
    return (isAllSelected || selectedCategories.includes(category));
  };

  return (
    <div className="filter-category-container">
      <CategoryDisplay
        selectedCategories={selectedCategories}
        showList={showList}
        setShowList={setShowList}
      />

      { showList && (
        <CategoryInputs
          categories={allCategories}
          isAllSelected={isAllSelected}
          isSelected={isSelected}
        />
      )}
    </div>
  );
};

export default FilterCategory;

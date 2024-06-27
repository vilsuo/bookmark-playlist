import { useState } from "react";
import CategoryDisplay from "./CategoryDisplay";
import CategoryInputs from "./CategoryInputs";

const FilterCategory = () => {
  const [showList, setShowList] = useState(false);

  return (
    <div className="filter-category">
      <CategoryDisplay
        showList={showList}
        setShowList={setShowList}
      />

      { showList && <CategoryInputs /> }
    </div>
  );
};

export default FilterCategory;

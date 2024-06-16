import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { selectCategories } from "../../../../redux/reducers/albumsSlice";
import { selectFilterCategories, setFilterCategories } from "../../../../redux/reducers/filterSlice";
import { CATEGORY_ALL } from "../../../../constants";

const FilterCategory = () => {
  const categories = useAppSelector(selectCategories);
  const selectedCategories = useAppSelector(selectFilterCategories);
  const dispatch = useAppDispatch();

  const [showList, setShowList] = useState(false);

  const ALL_SELECTED = selectedCategories.length === categories.length;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    
    if (!selectedCategories.includes(value)) {
      // add one
      dispatch(setFilterCategories([ ...selectedCategories, value ]));

    } else {
      // remove one
      dispatch(setFilterCategories(selectedCategories.filter(c => c !== value)));
    }
  };

  const handleToggle = () => {
    ALL_SELECTED
      ? dispatch(setFilterCategories([]))
      : dispatch(setFilterCategories(categories));
  };

  return (
    <div className="filter-category-container">
      <div className="category-display">
        <div className="selected">
          Categories:
          { !ALL_SELECTED
            ? selectedCategories.map(
              category => <span key={category}>{category}</span>
            )
            : <span>{CATEGORY_ALL}</span>
          }
        </div>

        <button onClick={() => setShowList(!showList)}>
          { !showList ? "Change" : "Close" }
        </button>
      </div>

      { showList && (
        <div className="category-filter">
          <label className={`all ${ ALL_SELECTED ? "checked" : "" }`}>
            <span>{CATEGORY_ALL}</span>
            <input type="checkbox"
              value={categories}
              checked={ALL_SELECTED}
              onChange={handleToggle}
            />
          </label>

          { categories.map(category => 
            <label key={category} className={ selectedCategories.includes(category) ? "checked" : "" }>
              <span>{category}</span>
              <input type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={handleChange}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterCategory;

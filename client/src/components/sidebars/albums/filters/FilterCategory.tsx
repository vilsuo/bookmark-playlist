import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { selectCategories } from "../../../../redux/reducers/albumsSlice";
import { selectFilterCategories, setFilterCategories } from "../../../../redux/reducers/filterSlice";
import { CATEGORY_ALL } from "../../../../constants";
import { Album } from "../../../../types";

const FilterCategory = () => {
  const categories = useAppSelector(selectCategories);
  const selectedCategories = useAppSelector(selectFilterCategories);
  const dispatch = useAppDispatch();

  const [showList, setShowList] = useState(false);

  const ALL_SELECTED = selectedCategories === CATEGORY_ALL;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    
    if (ALL_SELECTED) {
      // set all categories except one
      dispatch(setFilterCategories(categories.filter(c => c !== value)));

    } else {
      if (!selectedCategories.includes(value)) {
        // add one
        if (selectedCategories.length === categories.length - 1) {
          dispatch(setFilterCategories(CATEGORY_ALL));
        } else {
          dispatch(setFilterCategories([ ...selectedCategories, value ]));
        }
  
      } else {
        // remove one
        dispatch(setFilterCategories(selectedCategories.filter(c => c !== value)));
      }
    }
  };

  const handleToggle = () => {
    ALL_SELECTED
      ? dispatch(setFilterCategories([]))
      : dispatch(setFilterCategories(CATEGORY_ALL));
  };

  const isSelected = (category: Album["category"]) => {
    return (ALL_SELECTED || selectedCategories.includes(category));
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
            <label key={category} className={ isSelected(category) ? "checked" : "" }>
              <span>{category}</span>
              <input type="checkbox"
                value={category}
                checked={ isSelected(category) }
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

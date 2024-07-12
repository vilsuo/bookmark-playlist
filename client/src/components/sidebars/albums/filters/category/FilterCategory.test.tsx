import { describe, expect, test } from "@jest/globals";
import { fireEvent, screen } from "@testing-library/dom";
import { albums, categories, createAlbumWithCategory } from "../../../../../../test/constants";
import { createAlbumsFiltersRootState } from "../../../../../../test/state";
import { Album } from "../../../../../types";
import { FilterCategories, selectFilterCategories } from "../../../../../redux/reducers/filters/filterSlice";
import { renderWithProviders } from "../../../../../../test/render";
import FilterCategory from "./FilterCategory";
import { clickButton, findInputByLabelMatcher } from "../../../../../../test/uiHelpers";
import { CATEGORY_ALL } from "../../../../../constants";

const createTestState = (albums: Album[], categories: FilterCategories = []) => 
  createAlbumsFiltersRootState({ albums, filters: { categories }});

const getSelectedCategoriesDisplay = () => {
  return screen.getByTestId("selected-categories");
};

const toggleCheckbox = async (category: string) => {
  fireEvent.click(await findInputByLabelMatcher(category));
};

const toggleShowOptions = () => clickButton(/(Change|Close)/i);

const queryAllOptions = () => screen.queryAllByRole("checkbox");

describe("<FilterCategory />", () => {
  const otherCategory = categories[3];
  const initialAlbumCategories = [ categories[0], categories[1], categories[2] ];

  const initialAlbums = [
    createAlbumWithCategory(albums[0], initialAlbumCategories[0]),
    createAlbumWithCategory(albums[1], initialAlbumCategories[1]),
    createAlbumWithCategory(albums[2], initialAlbumCategories[2]),
  ];

  test("should not have options open by default", () => {
    const preloadedState = createTestState(initialAlbums);
    renderWithProviders(<FilterCategory />, { preloadedState });

    expect(queryAllOptions()).toHaveLength(0);
  });

  test("should be able to toggle open options", () => {
    const preloadedState = createTestState(initialAlbums);
    renderWithProviders(<FilterCategory />, { preloadedState });

    toggleShowOptions();

    expect(queryAllOptions()).toHaveLength(initialAlbumCategories.length + 1);

    toggleShowOptions();

    expect(queryAllOptions()).toHaveLength(0);
  });

  test("should display selected categories", () => {
    const preloadedState = createTestState(initialAlbums, [
        initialAlbumCategories[0],
        initialAlbumCategories[1],
    ]);

    renderWithProviders(<FilterCategory />, { preloadedState });

    const display = getSelectedCategoriesDisplay();
    expect(display).not.toHaveTextContent(new RegExp(CATEGORY_ALL));
    expect(display).toHaveTextContent(new RegExp(initialAlbumCategories[0]));
    expect(display).toHaveTextContent(new RegExp(initialAlbumCategories[1]));
    expect(display).not.toHaveTextContent(new RegExp(initialAlbumCategories[2]));
    expect(display).not.toHaveTextContent(new RegExp(otherCategory));
  });

  describe("when some categories are filtered", () => {
    const [ nonFilteredCategory, ...filteredCategories ] = initialAlbumCategories;

    const preloadedState = createTestState(initialAlbums, filteredCategories);

    test("should have checked the filtered categories", async () => {
      renderWithProviders(<FilterCategory />, { preloadedState });

      toggleShowOptions();

      expect(await findInputByLabelMatcher(CATEGORY_ALL)).not.toBeChecked();
      expect(await findInputByLabelMatcher(filteredCategories[0])).toBeChecked();
      expect(await findInputByLabelMatcher(filteredCategories[1])).toBeChecked();
      expect(await findInputByLabelMatcher(nonFilteredCategory)).not.toBeChecked();
    });

    test("should be able to check an option", async () => {
      const category = nonFilteredCategory;
      const { store } = renderWithProviders(<FilterCategory />, { preloadedState });

      toggleShowOptions();

      await toggleCheckbox(category);

      // category is added to the filtered categories state
      expect(selectFilterCategories(store.getState())).toContain(category);

      // category checkbox is checked
      expect(await findInputByLabelMatcher(category)).toBeChecked();

      // category is displayed in the filtered categories display
      const display = getSelectedCategoriesDisplay();
      expect(display).toHaveTextContent(new RegExp(category));
    });

    test("should be able to uncheck an option", async () => {
      const category = filteredCategories[1];
      const { store } = renderWithProviders(<FilterCategory />, { preloadedState });

      toggleShowOptions();

      await toggleCheckbox(category);

      // category is removed from the filtered categories state
      expect(selectFilterCategories(store.getState())).not.toContain(category);

      expect(await findInputByLabelMatcher(category)).not.toBeChecked();

      const display = getSelectedCategoriesDisplay();
      expect(display).not.toHaveTextContent(new RegExp(category));
    });

    test("should be able to check all option", async () => {
      const category = CATEGORY_ALL;
      const { store } = renderWithProviders(<FilterCategory />, { preloadedState });

      toggleShowOptions();

      await toggleCheckbox(category);

      expect(selectFilterCategories(store.getState())).toBe(category);

      expect(await findInputByLabelMatcher(category)).toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[0])).toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[1])).toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[2])).toBeChecked();

      const display = getSelectedCategoriesDisplay();
      expect(display).toHaveTextContent(new RegExp(category));
      expect(display).not.toHaveTextContent(new RegExp(initialAlbumCategories[0]));
      expect(display).not.toHaveTextContent(new RegExp(initialAlbumCategories[1]));
      expect(display).not.toHaveTextContent(new RegExp(initialAlbumCategories[2]));
    });
  });

  describe("when all categories are filtered", () => {
    const preloadedState = createTestState(initialAlbums, CATEGORY_ALL);

    test("should have checked all options", async () => {
      renderWithProviders(<FilterCategory />, { preloadedState });

      toggleShowOptions();

      expect(await findInputByLabelMatcher(CATEGORY_ALL)).toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[0])).toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[1])).toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[2])).toBeChecked();
    });

    test("should be able to uncheck all option", async () => {
      const category = CATEGORY_ALL;
      const { store } = renderWithProviders(<FilterCategory />, { preloadedState });

      toggleShowOptions();

      await toggleCheckbox(category);

      expect(selectFilterCategories(store.getState())).toHaveLength(0);

      expect(await findInputByLabelMatcher(category)).not.toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[0])).not.toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[1])).not.toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[2])).not.toBeChecked();

      const display = getSelectedCategoriesDisplay();
      expect(display).not.toHaveTextContent(new RegExp(category));
      expect(display).not.toHaveTextContent(new RegExp(initialAlbumCategories[0]));
      expect(display).not.toHaveTextContent(new RegExp(initialAlbumCategories[1]));
      expect(display).not.toHaveTextContent(new RegExp(initialAlbumCategories[2]));
    });

    test("should be able to uncheck a single option", async () => {
      const uncheckIdx = 1;
      const { store } = renderWithProviders(<FilterCategory />, { preloadedState });

      toggleShowOptions();

      await toggleCheckbox(initialAlbumCategories[uncheckIdx]);

      const result = selectFilterCategories(store.getState());
      expect(result).toContain(initialAlbumCategories[0]);
      expect(result).not.toContain(initialAlbumCategories[uncheckIdx]);
      expect(result).toContain(initialAlbumCategories[2]);

      expect(await findInputByLabelMatcher(CATEGORY_ALL)).not.toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[0])).toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[uncheckIdx])).not.toBeChecked();
      expect(await findInputByLabelMatcher(initialAlbumCategories[2])).toBeChecked();

      const display = getSelectedCategoriesDisplay();
      expect(display).not.toHaveTextContent(new RegExp(CATEGORY_ALL));
      expect(display).toHaveTextContent(new RegExp(initialAlbumCategories[0]));
      expect(display).not.toHaveTextContent(new RegExp(initialAlbumCategories[uncheckIdx]));
      expect(display).toHaveTextContent(new RegExp(initialAlbumCategories[2]));
    });
  });
});

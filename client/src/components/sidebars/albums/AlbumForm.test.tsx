import { describe, expect, jest, test } from "@jest/globals";
import { createDefaultAlbumsRootState } from "../../../../test/state";
import { Album, AlbumColumn } from "../../../types";
import { renderWithProviders } from "../../../../test/render";
import AlbumForm from "./AlbumForm";
import { albums, categories, createAlbumWithCategory, newAlbumValues } from "../../../../test/constants";
import { fireEvent, screen, within } from "@testing-library/dom";
import { changeOptionByLabel, clickButton, findInputByLabelMatcher } from "../../../../test/uiHelpers";
import { CATEGORY_OTHER } from "../../../constants";

const otherCategory = categories[3];
const initialAlbumCategories = [ categories[0], categories[1], categories[2] ];

const initialAlbums = [
  createAlbumWithCategory(albums[0], initialAlbumCategories[0]),
  createAlbumWithCategory(albums[1], initialAlbumCategories[1]),
  createAlbumWithCategory(albums[2], initialAlbumCategories[2]),
];

const album = {
  ...newAlbumValues,
  category: initialAlbumCategories[0],
};

const mockSubmit = jest.fn(async () => {});

const childText = "child component";

const MockChild = () => <span>{childText}</span>;

const renderAlbumForm = (albums: Album[] = []) => renderWithProviders(
  <AlbumForm album={album} submit={mockSubmit}>
    <MockChild />
  </AlbumForm>,
  { preloadedState: createDefaultAlbumsRootState({ albums }) },
);

const changeCategory = async (category: string) =>
  changeOptionByLabel("Category", category);

const findCategoryInput = async () =>
  findInputByLabelMatcher("Category");

const queryAllCategoryOptions = async () =>
  within(await findCategoryInput()).findAllByRole("option");

const queryNewInput = () => screen.queryByTestId("new-category-input");

describe("<AlbumForm>", () => {
  test("should render the children", () => {
    renderAlbumForm();

    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  test("should be able to submit the form", () => {
    renderAlbumForm();

    expect(mockSubmit).not.toHaveBeenCalled();

    clickButton("Submit");

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(album);
  });

  test("should have the album values in inputs", async () => {
    renderAlbumForm();

    expect(await findInputByLabelMatcher(AlbumColumn.ARTIST)).toHaveValue(album.artist);
    expect(await findInputByLabelMatcher(AlbumColumn.ALBUM)).toHaveValue(album.title);
    expect(await findInputByLabelMatcher(AlbumColumn.PUBLISHED)).toHaveValue(album.published);

    expect(await findInputByLabelMatcher("Video id")).toHaveValue(album.videoId);
  });

  describe("when there are no albums", () => {
    test("should have only other category option", async () => {
      renderAlbumForm();

      const options = await queryAllCategoryOptions();
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveValue(CATEGORY_OTHER);
    });

    test("should select the other category", async () => {
      renderAlbumForm();

      expect(await findCategoryInput()).toHaveValue(CATEGORY_OTHER);
      expect(queryNewInput()).toHaveValue(album.category);
    });
  });

  describe("when there are albums", () => {
    test("should have all category options sorted", async () => {
      renderAlbumForm(initialAlbums);

      const options = await queryAllCategoryOptions();
      expect(options).toHaveLength(initialAlbumCategories.length + 1);

      expect(options[0]).toHaveValue(CATEGORY_OTHER);
      initialAlbumCategories.toSorted().forEach((category, i) =>
        expect(options[i + 1]).toHaveValue(category)
      );
    });

    test("should select the album category", async () => {
      renderAlbumForm(initialAlbums);

      expect(await findCategoryInput()).toHaveValue(album.category);
      expect(queryNewInput()).not.toBeInTheDocument();
    });

    test("should be able to change category", async () => {
      const existingCategory = initialAlbumCategories[1];

      renderAlbumForm(initialAlbums);

      await changeCategory(existingCategory);

      const input = await findCategoryInput();
      expect(input).toHaveValue(existingCategory);
      expect(input).not.toHaveValue(album.category);

      expect(queryNewInput()).not.toBeInTheDocument();
    });

    test("should be able to change to a new category", async () => {
      const nonExistingCategory = otherCategory;
      renderAlbumForm(initialAlbums);

      // open new input
      await changeCategory(CATEGORY_OTHER);

      const subInput = queryNewInput();

      // type to new input
      fireEvent.change(subInput!, {
        target: { value: nonExistingCategory },
      });

      const input = await findCategoryInput();
      expect(input).toHaveValue(CATEGORY_OTHER);

      expect(subInput).toHaveValue(nonExistingCategory);
      expect(subInput).not.toHaveValue(album.category);
    });
  });
});

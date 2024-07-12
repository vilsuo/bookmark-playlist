import { describe, expect, test } from "@jest/globals";
import userEvent, { UserEvent } from '@testing-library/user-event';
import { screen } from "@testing-library/dom";
import { renderWithProviders } from "../../../../test/render";
import { findInputByLabelMatcher, submit } from "../../../../test/uiHelpers";
import { albums, newAlbum } from "../../../../test/constants";
import { selectAlbums } from "../../../redux/reducers/albums/albumsSlice";
import { createDefaultAlbumsRootState } from "../../../../test/state";
import ToolsBar from "./ToolsBar";

const findBookmarkInput = async () => findInputByLabelMatcher(/Root folder/i);
const findUploadInput = async () => findInputByLabelMatcher(/Attachment/i);
const getConvertButton = () => screen.getByRole("button", { name: /Convert/i });

const typeBookmarkNameToInput = async (user: UserEvent, value: string) =>
  user.type(await findBookmarkInput(), value);

const uploadFileToInput = async (user: UserEvent, file: File) =>
  user.upload(await findUploadInput(), file);

describe("<ToolsBar />", () => {
  const mockClose = () => {};

  const testBookmarkName = "My_bookmarks";
  const testFile = new File([], "test.html", { type: "text/html" });

  test("should render tools bar", async () => {
    renderWithProviders(<ToolsBar close={mockClose} />);

    screen.getByRole("heading", { name: "Tools" });
  });

  test("should be able to type bookmarks folder name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ToolsBar close={mockClose} />);

    await typeBookmarkNameToInput(user, testBookmarkName);

    expect(await findBookmarkInput()).toHaveDisplayValue(testBookmarkName);
  });

  test("should be able to input a file", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ToolsBar close={mockClose} />);

    await uploadFileToInput(user, testFile);

    const input = await findUploadInput();
    expect(input.files![0]).toBe(testFile);
    expect(input.files).toHaveLength(1);
  });

  test("should add albums after converting", async () => {
    const user = userEvent.setup();

    const preloadedState = createDefaultAlbumsRootState({ albums: [newAlbum] });
    const { store } = renderWithProviders(
      <ToolsBar close={mockClose} />,
      { preloadedState },
    );

    await typeBookmarkNameToInput(user, testBookmarkName);
    await uploadFileToInput(user, testFile);

    const convertButton = getConvertButton();
    expect(convertButton).toHaveProperty("disabled", false);

    await submit(convertButton);

    expect(selectAlbums(store.getState())).toEqual([ newAlbum, ...albums ]);
  });
});

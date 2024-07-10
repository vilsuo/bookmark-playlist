import { afterAll, afterEach, beforeAll, describe, expect, test } from "@jest/globals";
import userEvent, { UserEvent } from '@testing-library/user-event';
import { fireEvent, screen, waitFor } from "@testing-library/dom";

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { renderWithProviders } from "../../../../test/testUtils";
import { findInputByLabelMatcher } from "../../../../test/uiHelpers";
import { albums, newAlbum } from "../../../../test/constants";
import { BASE_URL } from "../../../util/converterService";
import { selectAlbums } from "../../../redux/reducers/albums/albumsSlice";
import { createAlbumsRootState } from "../../../../test/creators";
import ToolsBar from "./ToolsBar";

const findBookmarkInput = async () => findInputByLabelMatcher(/Root folder/i);
const findUploadInput = async () => findInputByLabelMatcher(/Attachment/i);
const findConvertButton = async () => screen.findByRole("button", { name: /Convert/i });

const typeBookmarkNameToInput = async (user: UserEvent, value: string) =>
  user.type(await findBookmarkInput(), value);

const uploadFileToInput = async (user: UserEvent, file: File) =>
  user.upload(await findUploadInput(), file);

describe("<ToolsBar />", () => {
  const mockClose = () => {};

  const testBookmarkName = "My_bookmarks";
  const testFile = new File([], "test.html", { type: "text/html" });

  const handlers = [
    http.post(BASE_URL, async () => {
      return HttpResponse.json(albums);
    }),
  ];

  const server = setupServer(...handlers);

  // Enable API mocking before tests.
  beforeAll(() => server.listen());

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  test("should render tools bar", async () => {
    renderWithProviders(<ToolsBar close={mockClose} />);

    screen.getByRole("heading", { name: "Tools" });
  });

  test("should be able to type bookmarks folder name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ToolsBar close={mockClose} />);

    await typeBookmarkNameToInput(user, testBookmarkName);

    expect(await findBookmarkInput()).toHaveDisplayValue(testBookmarkName);

    expect(await findConvertButton()).toHaveProperty("disabled", true);
  });

  test("should be able to input a file", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ToolsBar close={mockClose} />);

    await uploadFileToInput(user, testFile);

    const input = await findUploadInput();
    expect(input.files![0]).toBe(testFile);
    expect(input.files).toHaveLength(1);

    expect(await findConvertButton()).toHaveProperty("disabled", true);
  });

  test("should add albums after converting", async () => {
    const preloadedState = createAlbumsRootState([newAlbum]);

    const user = userEvent.setup();
    const { store } = renderWithProviders(<ToolsBar close={mockClose} />, { preloadedState });

    await typeBookmarkNameToInput(user, testBookmarkName);
    await uploadFileToInput(user, testFile);

    expect(await findConvertButton()).toHaveProperty("disabled", false);

    await waitFor(async () => {
      // https://stackoverflow.com/a/76565489
      // https://github.com/testing-library/user-event/issues/1032
      fireEvent.submit(await findConvertButton());
    });

    expect(await findConvertButton()).toHaveProperty("disabled", true);

    expect(selectAlbums(store.getState())).toEqual([ newAlbum, ...albums ]);
  });
});

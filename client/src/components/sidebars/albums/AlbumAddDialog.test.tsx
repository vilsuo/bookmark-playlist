import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { renderWithProviders } from "../../../../test/render";
import AlbumAddDialog from "./AlbumAddDialog";
import { createDefaultAlbumsRootState } from "../../../../test/state";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { BASE_URL as ALBUMS_BASE_URL } from "../../../util/albumService";
import { newAlbum, newAlbumValues } from "../../../../test/constants";
import { createServerMockErrorResponse } from "../../../../test/server";
import { selectAlbums } from "../../../redux/reducers/albums/albumsSlice";
import { fireEvent, screen } from "@testing-library/dom";
import userEvent, { UserEvent } from "@testing-library/user-event";

const album = newAlbumValues;

const mockClose = jest.fn();

const renderAlbumForm = () => renderWithProviders(
  <AlbumAddDialog album={album} isOpen={true} onClose={mockClose} />,
  { preloadedState: createDefaultAlbumsRootState() },
);

const clickCancel = () => fireEvent.click(
  screen.getByRole("button", { name: "Cancel", hidden: true })
);

const clickSubmit = async (user: UserEvent ) => 
  user.click( screen.getByRole("button", { name: "Add", hidden: true }));

describe("<AlbumAddDialog />", () => {
  const server = setupServer();
  
  // Enable API mocking before tests.
  beforeAll(() => server.listen());

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  test("should be able to close the dialog", () => {
    renderAlbumForm();

    clickCancel();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  describe("successfull upload", () => {
    beforeEach(() => {
      server.use(http.post(ALBUMS_BASE_URL, async () => {
        return HttpResponse.json(newAlbum);
      }));
    });

    test("should add the album", async () => {
      const user = userEvent.setup();
      const { store } = renderAlbumForm();

      await clickSubmit(user);

      const result = selectAlbums(store.getState());
      expect(result).toHaveLength(1);
      expect(result).toContainEqual(newAlbum);
    });

    test("should close the dialog", async () => {
      const user = userEvent.setup();
      renderAlbumForm();

      await clickSubmit(user);

      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("unsuccessfull upload", () => {
    const message = "validation failed";

    beforeEach(() => {
      server.use(http.post(ALBUMS_BASE_URL, async () => {
        return createServerMockErrorResponse(message);
      }));
    });

    test("should not add the album", async () => {
      const user = userEvent.setup();
      const { store } = renderAlbumForm();

      await clickSubmit(user);

      expect(selectAlbums(store.getState())).toHaveLength(0);
    });

    test("should not close the dialog", async () => {
      const user = userEvent.setup();
      renderAlbumForm();

      await clickSubmit(user);

      expect(mockClose).not.toHaveBeenCalled();
    });
  });
});

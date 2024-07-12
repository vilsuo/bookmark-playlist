import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { renderWithProviders } from "../../../../test/render";
import AlbumAddDialog from "./AlbumAddDialog";
import { createDefaultAlbumsRootState } from "../../../../test/state";
import { http } from "msw";
import { BASE_URL as ALBUMS_BASE_URL } from "../../../util/albumService";
import { newAlbum, newAlbumValues } from "../../../../test/constants";
import server, { createServerMockErrorResponse } from "../../../../test/server";
import { selectAlbums } from "../../../redux/reducers/albums/albumsSlice";
import { fireEvent, screen } from "@testing-library/dom";
import { submit } from "../../../../test/uiHelpers";

const album = newAlbumValues;

const mockClose = jest.fn();

const renderAlbumForm = () => renderWithProviders(
  <AlbumAddDialog album={album} isOpen={true} onClose={mockClose} />,
  { preloadedState: createDefaultAlbumsRootState() },
);

const clickCancel = () => fireEvent.click(
  screen.getByRole("button", { name: "Cancel", hidden: true })
);

const getSubmitButton = () => screen.getByRole("button", { name: "Add", hidden: true });

describe("<AlbumAddDialog />", () => {
  test("should be able to close the dialog", () => {
    renderAlbumForm();

    clickCancel();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  describe("successfull upload", () => {
    test("should add the album", async () => {
      const { store } = renderAlbumForm();

      await submit(getSubmitButton());

      const result = selectAlbums(store.getState());
      expect(result).toHaveLength(1);
      expect(result).toContainEqual(newAlbum);
    });

    test("should close the dialog", async () => {
      renderAlbumForm();

      await submit(getSubmitButton());

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
      const { store } = renderAlbumForm();

      await submit(getSubmitButton());

      expect(selectAlbums(store.getState())).toHaveLength(0);
    });

    test("should not close the dialog", async () => {
      renderAlbumForm();

      await submit(getSubmitButton());

      expect(mockClose).not.toHaveBeenCalled();
    });
  });
});

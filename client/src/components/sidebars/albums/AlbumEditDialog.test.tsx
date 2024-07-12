// TODO: test component with Cypress (jestdom does not support dialogs) so that
// test do not test hidden elements!

/*
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import AlbumEditDialog from "./AlbumEditDialog";
import { renderWithProviders } from "../../../../test/render";
import { albums, newAlbumValues } from "../../../../test/constants";
import { createDefaultAlbumsRootState } from "../../../../test/state";
import { fireEvent, screen, within } from "@testing-library/dom";
import { http } from "msw";
import { BASE_URL as ALBUMS_BASE_URL } from "../../../util/albumService";
import { selectAlbums } from "../../../redux/reducers/albums/albumsSlice";
import { AlbumColumn } from "../../../types";
import { changeOptionByLabel, submit } from "../../../../test/uiHelpers";
import server, { createServerMockErrorResponse } from "../../../../test/server";

const editIdx = 1;
const album = albums[editIdx];

const mockClose = jest.fn();

const renderAlbumForm = () => renderWithProviders(
  <AlbumEditDialog album={album} isOpen={true} onClose={mockClose} />,
  { preloadedState: createDefaultAlbumsRootState({ albums }) },
);

// Edit dialog
const getEditDialog = () => screen.getByTestId("edit-dialog")

const getEditSubmitButton = () => within(getEditDialog()!)
  .getByRole("button", { name: "Save", hidden: true });

const clickEditCancel = () => fireEvent.click(
  within(getEditDialog()!).getByRole("button", {
    name: "Cancel",
    hidden: true,
  })
);


const clickOpenConfirm = () => fireEvent.click(
  screen.getByRole("button", { name: "Remove", hidden: true })
);


// Confirm dialog
const queryConfirmDialog = () => screen.getByTestId("confirm-dialog")

const clickConfirmOk = () => fireEvent.click(
  within(queryConfirmDialog()!).getByRole("button", {
    name: "Confirm",
    hidden: true,
  })
);

const clickConfirmCancel = () => fireEvent.click(
  within(queryConfirmDialog()!).getByRole("button", {
    name: "Cancel",
    hidden: true,
  })
);

describe("<AlbumEditDialog />", () => {
  const newTitle = newAlbumValues.title;

  const updatedAlbum = { ...album, title: newTitle };

  test.only("should be able to close the dialog", () => {
    renderAlbumForm();

    screen.debug(getEditDialog())

    clickEditCancel();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  describe("editing", () => {
    describe("successfull edit", () => {
      test("should edit the album", async () => {
        const { store } = renderAlbumForm();

        await changeOptionByLabel(AlbumColumn.ALBUM, newTitle);

        await submit(getEditSubmitButton());

        const result = selectAlbums(store.getState());
        expect(result).toHaveLength(albums.length);
        expect(result).not.toContainEqual(album);
        expect(result).toContainEqual(updatedAlbum);
      });

      test("should close the dialog", async () => {
        renderAlbumForm();

        await submit(getEditSubmitButton());

        expect(mockClose).toHaveBeenCalledTimes(1);
      });
    });

    describe("unsuccessfull edit", () => {
      const message = "validation failed";

      beforeEach(() => {
        server.use(http.put(`${ALBUMS_BASE_URL}:/id`, async () => {
          return createServerMockErrorResponse(message);
        }));
      });

      test("should not edit the album", async () => {
        const { store } = renderAlbumForm();

        await submit(getEditSubmitButton());

        expect(selectAlbums(store.getState())).not.toContainEqual(updatedAlbum);
      });

      test("should not close the dialog", async () => {
        renderAlbumForm();

        await submit(getEditSubmitButton());

        expect(mockClose).not.toHaveBeenCalled();
      });
    });
  });

  describe("removing", () => {
    test("should be able to open the confirm dialog", () => {
      renderAlbumForm();
  
      clickOpenConfirm();

      expect(queryConfirmDialog()).toBeInTheDocument();
    });

    describe("confirming", () => {
      test("should remove the album", () => {
        const { store } = renderAlbumForm();
        clickOpenConfirm();

        clickConfirmOk();

        expect(selectAlbums(store.getState())).not.toContainEqual(album);
      });

      test("should close the dialog", () => {
        renderAlbumForm();
        clickOpenConfirm();

        clickConfirmOk();

        expect(mockClose).toHaveBeenCalledTimes(1);
      });
    });

    describe("cancelling", () => {
      test("should not remove the album", () => {
        const { store } = renderAlbumForm();
        clickOpenConfirm();

        clickConfirmCancel();
  
        expect(selectAlbums(store.getState())).toContainEqual(album);
      });

      test("should only close the confirm dialog", () => {
        renderAlbumForm();
        clickOpenConfirm();

        clickConfirmCancel();

        expect(queryConfirmDialog()).not.toBeInTheDocument();
        expect(mockClose).not.toHaveBeenCalled();
      });
    });
  });
});
*/

import AlbumEditDialog from "./AlbumEditDialog";
import { albums, newAlbumValues } from "../../../../test/constants";
import { createDefaultAlbumsRootState } from "../../../../test/state";
import { BASE_URL as ALBUMS_BASE_URL } from "../../../util/albumService";
import { selectAlbums } from "../../../redux/reducers/albums/albumsSlice";
import { HttpMethods } from "msw";
import { AlbumColumn } from "../../../types";

const editIdx = 1;
const album = albums[editIdx];

const mountAlbumDialog = (close = () => {}) => cy.mount(
  <AlbumEditDialog album={album} isOpen={true} onClose={close} />,
  { preloadedState: createDefaultAlbumsRootState({ albums }) },
);

// Edit dialog
const clickEditCancel = () => cy.contains(".album-form button", /Cancel/).click();
const clickEditSubmit = () => cy.contains(".album-form button", /Save/).click();

/*
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
*/

describe("<AlbumEditDialog />", () => {
  const newTitle = newAlbumValues.title;

  const updatedAlbum = { ...album, title: newTitle };

  it('renders', () => {
    mountAlbumDialog();
  });

  it("should be able to close the dialog", () => {
    const mockClose = cy.stub().as("close");
    mountAlbumDialog(mockClose);

    clickEditCancel();
    cy.get("@close").should('have.been.calledOnce');
  });

  describe("editing", () => {
    const alias = '@putAlbum';

    describe("successfull edit", () => {
      beforeEach(() => {
        cy.interceptRequest(
          HttpMethods.PUT,
          `${ALBUMS_BASE_URL}/${album.id}`,
          alias.substring(1),
        );
      });

      it("should edit the album", () => {
        mountAlbumDialog().then(({ store }) => {
          // type a new album title
          cy.findByLabelText(AlbumColumn.ALBUM).clear().type(newTitle);

          clickEditSubmit();

          cy.waitForRequest(alias).then(() => {
            const result = selectAlbums(store.getState());

            // no albums are added
            expect(result).to.haveOwnProperty("length", albums.length);

            // album is updated
            expect(result[editIdx]).to.deep.equal(updatedAlbum);
            expect(result[editIdx]).not.to.deep.equal(album);
          });
        });
      });

      it("should close the dialog", () => {
        const mockClose = cy.stub().as("close");
        mountAlbumDialog(mockClose);

        clickEditSubmit();
        cy.get("@close").should('have.been.calledOnce');
      });
    });
  
    /*
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
    */
  });

  /*
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
  */
});

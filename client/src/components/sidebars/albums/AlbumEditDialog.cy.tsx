import AlbumEditDialog from "./AlbumEditDialog";
import { albums, newAlbumValues } from "../../../../test/constants";
import { createDefaultAlbumsRootState } from "../../../../test/state";
import { BASE_URL as ALBUMS_BASE_URL } from "../../../util/albumService";
import { selectAlbums } from "../../../redux/reducers/albums/albumsSlice";
import { AlbumColumn } from "../../../types";
import { createServerMockErrorResponse } from "../../../../test/mocks/response";
import { HttpMethods } from "../../../../cypress/support/interceptor";

const editIdx = 1;
const album = albums[editIdx];

const putBaseUrl = `${ALBUMS_BASE_URL}/${album.id}`;

const mountAlbumDialog = (close = () => {}) => cy.mount(
  <AlbumEditDialog album={album} isOpen={true} onClose={close} />,
  { preloadedState: createDefaultAlbumsRootState({ albums }) },
);

// Edit dialog
const clickEditCancel = () => cy.contains(".album-form button", /Cancel/).click();
const clickEditSubmit = () => cy.contains(".album-form button", /Save/).click();

const clickOpenConfirm = () => cy.contains(".album-form button", /Remove/).click();

// Confirm dialog
const confirmDialogTestId = "delete-confirm";

const clickConfirmOk = () => {
  cy.findByTestId(confirmDialogTestId).within(() => {
    cy.findByRole("button", { name: /Confirm/ }).click();
  });
};

const clickConfirmCancel = () => {
  cy.findByTestId(confirmDialogTestId).within(() => {
    cy.findByRole("button", { name: /Cancel/ }).click();
  });
};

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

  it("should be able to open the delete confirm dialog", () => {
    mountAlbumDialog();

    clickOpenConfirm();

    cy.findByTestId(confirmDialogTestId);
  });

  describe("editing", () => {
    const alias = '@putAlbum';

    describe("successfull edit", () => {
      beforeEach(() => {
        cy.interceptRequest(
          HttpMethods.PUT,
          putBaseUrl,
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
  
    describe("unsuccessfull edit", () => {
      const message = "validation failed";

      beforeEach(() => {
        cy.interceptRequest(
          HttpMethods.PUT,
          putBaseUrl,
          alias.substring(1),
          () => createServerMockErrorResponse(message),
        );
      });

      it("should not edit the album", () => {
        mountAlbumDialog().then(({ store }) => {
          // type a new album title
          cy.findByLabelText(AlbumColumn.ALBUM).clear().type(newTitle);

          clickEditSubmit();

          cy.waitForRequest(alias).then(() => {
            const result = selectAlbums(store.getState());

            // no albums are added
            expect(result).to.haveOwnProperty("length", albums.length);

            // album is not updated
            expect(result[editIdx]).not.to.deep.equal(updatedAlbum);
            expect(result[editIdx]).to.deep.equal(album);
          });
        });
      });

      it("should not close the dialog", () => {
        const mockClose = cy.stub().as("close");
        mountAlbumDialog(mockClose);

        clickEditSubmit();
        cy.waitForRequest(alias).then(() => {
          cy.get("@close").should('not.have.been.called');
        });
      });
    });
  });

  describe("removing", () => {
    const alias = "@deleteAlbum";

    beforeEach(() => {
      cy.interceptRequest(
        HttpMethods.DELETE,
        putBaseUrl,
        alias.substring(1),
      );
    });
    describe("confirming", () => {
      it("should remove the album", () => {
        mountAlbumDialog().then(({ store }) => {
          clickOpenConfirm();
          clickConfirmOk();

          cy.waitForRequest(alias).then(() => {
            const result = selectAlbums(store.getState());

            // album is deleted
            expect(result).to.haveOwnProperty("length", albums.length - 1);
            expect(result).not.to.contain(album);

            cy.getRequestCalls(alias).then(calls => {
              expect(calls).to.have.length(1);
            });
          });
        });
      });

      it("should close the dialog", () => {
        const mockClose = cy.stub().as("close");
        mountAlbumDialog(mockClose);

        clickOpenConfirm();
        clickConfirmOk();

        cy.waitForRequest(alias).then(() => {
          cy.get("@close").should('have.been.called');
        });
      });
    });

    describe("cancelling", () => {
      it("should not remove the album", () => {
        mountAlbumDialog().then(({ store }) => {
          clickOpenConfirm();
          clickConfirmCancel();

          // wait for dialog to be closed instead, since a request is not sent
          cy.findAllByTestId(confirmDialogTestId).should('not.be.visible').then(() => {
            const result = selectAlbums(store.getState());

            // album is not deleted
            expect(result).to.haveOwnProperty("length", albums.length);
            expect(result).to.contain(album);

            cy.getRequestCalls(alias).then(calls => {
              expect(calls).to.have.length(0);
            });
          });
        });
      });

      it("should only close the confirm dialog", () => {
        const mockClose = cy.stub().as("close");
        mountAlbumDialog(mockClose);

        clickOpenConfirm();
        clickConfirmCancel();

        // confirm dialog does not exist
        cy.findAllByTestId(confirmDialogTestId).should('not.be.visible');

        cy.get("@close").should('not.have.been.calledOnce');
      });
    });
  });
});

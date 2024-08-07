import AlbumAddDialog from './AlbumAddDialog';
import { newAlbum, newAlbumValues } from '../../../../test/constants';
import { createDefaultAlbumsRootState } from '../../../../test/state';
import { selectAlbums } from '../../../redux/reducers/albums/albumsSlice';
import { BASE_URL as ALBUMS_BASE_URL } from '../../../util/albumService';
import { createServerMockErrorResponse } from '../../../../test/mocks/response';
import { HttpMethods } from '../../../../cypress/support/interceptor';

const album = newAlbumValues;

const mountAlbumDialog = (close = () => {}) => cy.mount(
  <AlbumAddDialog album={album} isOpen={true} onClose={close} />,
  { preloadedState: createDefaultAlbumsRootState() },
);

const clickCancel = () => cy.contains("button", /Cancel/).click();

const clickAdd = () => cy.contains("button", /Add/).click();

describe('<AlbumAddDialog />', () => {
  const alias = '@postAlbum';

  it('renders', () => {
    mountAlbumDialog();
  });

  it("should be able to close the dialog", () => {
    const mockClose = cy.stub().as("close");
    mountAlbumDialog(mockClose);

    clickCancel();
    cy.get("@close").should('have.been.calledOnce');
  });

  describe("successfull upload", () => {
    beforeEach(() => {
      cy.interceptRequest(
        HttpMethods.POST,
        ALBUMS_BASE_URL,
        alias.substring(1),
      );
    });

    it("should add the album", () => {
      mountAlbumDialog().then(({ store }) => {
        clickAdd();
        cy.waitForRequest(alias).then(() => {
          const result = selectAlbums(store.getState());

          expect(result).to.haveOwnProperty("length", 1);
          expect(result[0]).to.deep.equal(newAlbum);

          cy.getRequestCalls(alias).then(calls => {
            expect(calls).to.have.length(1);
          });
        });
      });
    });

    it("should close the dialog", () => {
      const mockClose = cy.stub().as("close");
      mountAlbumDialog(mockClose);

      clickAdd();
      cy.get("@close").should('have.been.calledOnce');
    });
  });

  describe("unsuccessfull upload", () => {
    const message = "validation failed";

    beforeEach(() => {
      cy.interceptRequest(
        HttpMethods.POST,
        ALBUMS_BASE_URL,
        alias.substring(1),
        () => createServerMockErrorResponse(message),
      );
    });

    it("should not add the album", () => {
      mountAlbumDialog().then(({ store }) => {
        clickAdd();
        cy.waitForRequest(alias).then(() => {
          const result = selectAlbums(store.getState());

          expect(result).to.haveOwnProperty("length", 0);

          cy.getRequestCalls(alias).then(calls => {
            expect(calls).to.have.length(1);
          });
        });
      });
    });

    it("should not close the dialog", () => {
      const mockClose = cy.stub().as("close");
      mountAlbumDialog(mockClose);

      clickAdd();
      cy.waitForRequest(alias).then(() => {
        cy.get("@close").should('not.have.been.called');
      });
    });
  });
});

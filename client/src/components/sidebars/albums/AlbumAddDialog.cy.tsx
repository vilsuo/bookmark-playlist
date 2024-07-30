import AlbumAddDialog from './AlbumAddDialog';
import { newAlbum, newAlbumValues } from '../../../../test/constants';
import { createDefaultAlbumsRootState } from '../../../../test/state';
import { selectAlbums } from '../../../redux/reducers/albums/albumsSlice';
import { BASE_URL as ALBUMS_BASE_URL } from '../../../util/albumService';

//import { waitForServiceWorker, serviceWorker } from "../../../../cypress/support/msw";

const album = newAlbumValues;

const mountAlbumForm = (close = () => {}) => cy.mount(
  <AlbumAddDialog album={album} isOpen={true} onClose={close} />,
  { preloadedState: createDefaultAlbumsRootState() },
);

const clickCancel = () => cy.contains("button", /Cancel/).click();

const clickAdd = () => cy.contains("button", /Add/).click();

describe('<AlbumAddDialog />', () => {
  it('renders', () => {
    mountAlbumForm();
  });

  it("should be able to close the dialog", () => {
    const mockClose = cy.stub();
    mountAlbumForm(mockClose);

    clickCancel().then(() => expect(mockClose).to.be.calledOnce);
  });

  describe("successfull upload", () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: "POST",
          url: ALBUMS_BASE_URL,
        },
        newAlbum
      ).as("postAlbum")
    });

    it("should add the album", () => {
      mountAlbumForm().then(({ store }) => {

        cy.log("store", store)

        clickAdd();
        cy.wait("@postAlbum").then(() => {
          const result = selectAlbums(store.getState());

          expect(result).to.haveOwnProperty("length", 1);
          expect(result[0]).to.deep.equal(newAlbum);
        });
      });
    });

    it("should close the dialog", () => {
      const mockClose = cy.stub();
      mountAlbumForm(mockClose);

      clickAdd();
      cy.wait("@postAlbum").then(() => expect(mockClose).to.be.calledOnce);
    });
  });

  /*
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
  */
});

import { Album } from './album.entity';
import { AlbumRepository } from './album.repository';
import { ALBUM_BASE, createAlbum } from '../../test/constants';
import { AppDataSource } from '../util/dataSource';
import * as validator from 'class-validator';
import { AlbumValidationError } from '../errors';

const existsSpy = jest
  .spyOn(AlbumRepository, 'existsBy')
  .mockImplementation();

const createSpy = jest
  .spyOn(AlbumRepository, 'create')
  .mockImplementation();

const saveSpy = jest
  .spyOn(AlbumRepository, 'save')
  .mockImplementation();

const validateSpy = jest
  .spyOn(validator, 'validateOrReject')
  .mockImplementation();

describe('createAndSave', () => {

  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('when album already exists', () => {
    let value: Album | undefined;

    beforeAll(async () => {
      existsSpy.mockResolvedValue(true);
      value = await AlbumRepository.createAndSave(ALBUM_BASE);
    });

    it('undefined is returned', () => {
      expect(value).toBe(undefined);
    });

    it('save has not been called', () => {
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('album has not been valitated', () => {
      expect(validateSpy).not.toHaveBeenCalled();
    });
  });

  describe('when album does not exist', () => {
    let value: Album | undefined;

    const createdAlbum = createAlbum(ALBUM_BASE);

    beforeEach(async () => {
      existsSpy.mockResolvedValueOnce(false);
      createSpy.mockReturnValueOnce(createdAlbum);
    });

    describe('without validation errors', () => {
      const id = 123;
      beforeEach(async () => {
        validateSpy.mockImplementationOnce(async () => { console.log('Mocked!'); });

        saveSpy.mockImplementationOnce(async () => {
          const album = createAlbum(ALBUM_BASE);
          album.id = id;
          return album;
        });
        value = await AlbumRepository.createAndSave(ALBUM_BASE);
      });

      it('created album is returned', () => {
        expect(value).toStrictEqual(
          expect.objectContaining({ id, ...ALBUM_BASE }),
        );
      });
  
      it('save has been called', () => {
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(saveSpy).toHaveBeenCalledWith(ALBUM_BASE);
      });
  
      it('album has been valitated', () => {
        expect(validateSpy).toHaveBeenCalled();
      });
    });

    describe('with validation errors', () => {
      beforeEach(async () => {
        validateSpy.mockImplementationOnce(async () => {
          const error = new validator.ValidationError();
          error.target = createdAlbum;
          error.property = 'published';
          error.value = ALBUM_BASE.published;

          throw [error];
        });

        // error is thrown
        await expect(async () => await AlbumRepository.createAndSave(ALBUM_BASE))
          .rejects.toThrow(AlbumValidationError);
      });

      it('album has not been saved', () => {
        expect(saveSpy).not.toHaveBeenCalled();
      });
    });
  });
});


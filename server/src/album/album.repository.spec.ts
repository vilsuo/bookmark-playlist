import { Album } from './album.entity';
import { AlbumRepository } from './album.repository';
import { ALBUM_BASE, createAlbum } from '../../test/constants';
import { AppDataSource } from '../util/dataSource';
import * as validator from 'class-validator';
import { AlbumValidationError } from '../errors';

const saveSpy = jest
  .spyOn(AlbumRepository, 'save')
  .mockImplementation();

const validateSpy = jest
  .spyOn(validator, 'validateOrReject')
  .mockImplementation();

describe('validateAndSave', () => {

  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  let result: Album;

  const album = createAlbum(ALBUM_BASE);
  const createdAlbum = createAlbum({ ...ALBUM_BASE, id: 123 })

  describe('without validation errors', () => {

    beforeEach(async () => {
      validateSpy.mockImplementationOnce(async () => { console.log('Mocked!'); });

      saveSpy.mockImplementationOnce(async () => createdAlbum);

      result = await AlbumRepository.validateAndSave(album);
    });

    it('created album is returned', () => {
      expect(result).toStrictEqual(
        expect.objectContaining(createdAlbum),
      );
    });

    it('save has been called', () => {
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(album);
    });

    it('album has been valitated', () => {
      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('with validation errors', () => {
    beforeEach(async () => {
      validateSpy.mockImplementationOnce(async () => {
        const error = new validator.ValidationError();
        error.target = album;
        error.property = 'published';
        error.value = album.published;

        throw [error];
      });

      // error is thrown
      await expect(async () => await AlbumRepository.validateAndSave(album))
        .rejects.toThrow(AlbumValidationError);
    });

    it('album has not been saved', () => {
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});

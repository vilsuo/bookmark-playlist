import { Album } from './album.entity';
import { AlbumRepository } from './album.repository';
import { ALBUM_BASE } from '../../test/constants';
import { AppDataSource } from '../util/dataSource';
import { DeepPartial } from 'typeorm';
import * as validator from 'class-validator';
import { AlbumValidationError } from '../errors';

// TODO: handle this better
const assignAll = (obj: DeepPartial<Album>, album: Album) => {
  const { id, videoId, artist, title, published, category, addDate } = obj;

  if (id !== undefined) album.id = id;
  if (videoId !== undefined) album.videoId = videoId;
  if (artist !== undefined) album.artist = artist;
  if (title !== undefined) album.title = title;
  if (published !== undefined) album.published = published;
  if (category !== undefined) album.category = category;
  if (addDate !== undefined && typeof addDate.toString === 'function') {
    album.addDate = new Date(addDate.toString());
  }
  return album;
};

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

    const createdAlbum = assignAll(ALBUM_BASE, new Album());

    beforeEach(async () => {
      existsSpy.mockResolvedValueOnce(false);
      createSpy.mockReturnValueOnce(createdAlbum);
    });

    describe('without validation errors', () => {
      beforeEach(async () => {
        validateSpy.mockImplementationOnce(async () => { console.log('Mocked!'); });

        const album = new Album();
        album.id = 1;
        saveSpy.mockResolvedValueOnce(assignAll(ALBUM_BASE, album));
        value = await AlbumRepository.createAndSave(ALBUM_BASE);
      });

      it('created album is returned', () => {
        expect(value).toStrictEqual(
          expect.objectContaining({
            id: expect.any(Number),
            ...ALBUM_BASE,
          }),
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


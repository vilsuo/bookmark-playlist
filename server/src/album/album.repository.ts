import { ValidationError, validateOrReject } from 'class-validator';
import { AppDataSource } from '../util/dataSource';
import { Album } from './album.entity';
import { AlbumBase } from '../types';
import { AlbumValidationError } from '../errors';

export const AlbumRepository = AppDataSource.getRepository(Album).extend({
  async existsByArtistAndTitle(artist: string, title: string) {
    return await this.existsBy({ artist, title });
  },

  async createAndSave(base: AlbumBase) {
    const album = this.create(base);

    try {
      await validateOrReject(album);
      return await this.save(album);
  
    } catch (error: unknown) {
      if (isValidationErrorArray(error)) {
        throw new AlbumValidationError(error);
      }

      console.log('createAndSave: Other error');
      throw error;
    }
  },
});

const isValidationErrorArray = (error: unknown): error is ValidationError[] => {
  return (
    Array.isArray(error) &&
    error.filter((err) => err instanceof ValidationError).length === error.length
  );
};

import { ValidationError, validateOrReject } from 'class-validator';
import { AppDataSource } from '../util/dataSource';
import { Album } from './album.entity';
import { AlbumBase } from '../types';
import { AlbumValidationError } from '../errors';

export const AlbumRepository = AppDataSource.getRepository(Album).extend({
  async existsByArtistAndTitle(artist: string, title: string) {
    return await this.existsBy({ artist, title });
  },

  /**
   * Creates an {@link Album} if the album with  given artist and title does not
   * already exist
   * 
   * @param base album to be created
   * @returns 
   */
  async createAndSave(base: AlbumBase): Promise<Album | undefined> {
    try {
      const exists = await this.existsByArtistAndTitle(base.artist, base.title);
      if (!exists) {
        const album = this.create(base);
        await validateOrReject(album);
        return await this.save(album);
      }
      return undefined;
  
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

import { AlbumBase } from '../types';
import { AlbumRepository } from './album.repository';
import { Album } from './album.entity';
import { AppDataSource } from '../util/dataSource';

type AlbumQueryOptions = {
  category?: string;
};

export const findAll = async (queryOptions: AlbumQueryOptions = {}) => {
  return await AlbumRepository.find({ where: queryOptions });
};

export const createAndSave = async (base: AlbumBase): Promise<Album> => {
  return await AlbumRepository.createAndSave(base);
};

export const createAndSaveMany = async (bases: AlbumBase[]): Promise<Album[]> => {
  return AppDataSource.transaction(async (manager) => {
    const albumsRepository = manager.withRepository(AlbumRepository);
    return await Promise.all(bases.map(
      async (base) => await albumsRepository.createAndSave(base)
    ));
  });
};

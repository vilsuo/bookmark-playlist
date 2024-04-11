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

export const createIfNotExists = async (base: AlbumBase): Promise<Album | undefined> => {
  const exists = await AlbumRepository.existsByArtistAndTitle(
    base.artist, base.title,
  );

  if (!exists) {
    return await AlbumRepository.validateAndSave(
      AlbumRepository.create(base),
    );
  }
  return undefined;
};

const notNull = (value: Album | undefined): value is Album => {
  return value != undefined;
};

export const createIfNotExistsMany = async (bases: AlbumBase[]): Promise<Album[]> => {
  return AppDataSource.transaction(async (manager) => {
    const albumsRepository = manager.withRepository(AlbumRepository);
    const nullable = await Promise.all(bases.map(
      async (base) => {
        const exists = await albumsRepository.existsByArtistAndTitle(
          base.artist, base.title,
        );

        if (!exists) {
          return await albumsRepository.validateAndSave(
            albumsRepository.create(base),
          );
        }
        return undefined;
      }
    ));

    return nullable.filter(notNull);
  });
};
/*
export const update = async (id: number, values: AlbumUpdate) => {
  const album = await AlbumRepository.findOneBy({ id });
  if (!album) {
    throw new Error('Album does not exist');
  }

  const { videoId, artist, title, published, category } = values;
  if (videoId !== undefined) { album.videoId = videoId; }
  if (artist !== undefined) { album.artist = artist; }
  if (title !== undefined) { album.title = title; }
  if (published !== undefined) { album.published = published; }
  if (category !== undefined) { album.category = category; }

  return AlbumRepository.validateAndSave(album);
};
*/

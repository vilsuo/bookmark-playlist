import { AlbumBase } from '../types';
import { AlbumRepository } from './album.repository';
import { Album } from './album.entity';
import { AppDataSource } from '../util/dataSource';

export const findAll = async () => await AlbumRepository.find();

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

export const update = async (id: number, values: AlbumBase) => {
  const album = await AlbumRepository.findOneBy({ id });
  if (!album) {
    throw new Error('Album does not exist');
  }

  const { videoId, artist, title, published, category, addDate } = values;
  album.videoId = videoId;
  album.artist = artist;
  album.title = title;
  album.published = published;
  album.category = category;
  album.addDate = addDate;

  return await AlbumRepository.validateAndSave(album);
};

export const remove = async (id: number) => {
  await AlbumRepository.delete({ id });
};

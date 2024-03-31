import { AlbumBase } from '../types';
import { AlbumRepository } from './album.repository';

export const createMany = async (albumBases: AlbumBase[]) => {
  await AlbumRepository.insert(albumBases);
};

export const findAll = async () => {
  await AlbumRepository.find();
};

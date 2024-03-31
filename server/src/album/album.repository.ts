import { AppDataSource } from '../util/dataSource';
import { Album } from './album.entity';

export const AlbumRepository = AppDataSource.getRepository(Album);

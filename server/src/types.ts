import { Album } from './album/album.entity';

export type Link = {
  text: string;
  href: string | undefined;
  addDate: string | undefined;
};

export type FolderLink = Link & {
  folder: string;
};

/**
 * type for creating a new {@link Album}
 */
export type AlbumBase = Omit<Album, 'id'>;

/**
 * type for updating an existing {@link Album}
 */
export type AlbumBodyBase = Omit<AlbumBase, 'addDate'>;
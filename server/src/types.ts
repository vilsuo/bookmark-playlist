import { Album } from './album/album.entity';

export type Link = {
  text: string;
  href: string | undefined;
  addDate: string | undefined;
};

export type FolderLink = Link & {
  folder: string;
};

export type AlbumBase = Omit<Album, 'id'>;

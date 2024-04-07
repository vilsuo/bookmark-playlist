import { convertEpoch } from '../src/bookmark/linkParser';
import { AlbumBase, FolderLink } from '../src/types';

export const FOLDER_LINK: FolderLink = {
  text: 'Annihilator - Alice In Hell (1989)',
  href: 'https://www.youtube.com/watch?v=IdRn9IYWuaQ',
  addDate: '1711022745',
  folder: 'Thrash',
};

export const ALBUM_BASE: AlbumBase = {
  videoId: 'IdRn9IYWuaQ',
  artist: 'Annihilator',
  title: 'Alice In Hell',
  published: 1989,
  category: 'Thrash',
  addDate: convertEpoch(1711022745),
};

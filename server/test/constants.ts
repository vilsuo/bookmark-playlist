import { Album } from '../src/album/album.entity';
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
  category: FOLDER_LINK.folder,
  addDate: convertEpoch(Number(FOLDER_LINK.addDate)),
};

export const createAlbum = (base: AlbumBase) => {
  const album = new Album();
  album.videoId = base.videoId;
  album.artist = base.artist;
  album.title = base.title;
  album.published = base.published;
  album.category = base.category;
  album.addDate = base.addDate;
  return album;
};

//export const ALBUM_CREATED = new Album();
//ALBUM_CREATED.videoId = ALBUM_BASE.videoId;
//ALBUM_CREATED.artist = ALBUM_BASE.artist;
//ALBUM_CREATED.title = ALBUM_BASE.title;
//ALBUM_CREATED.published = ALBUM_BASE.published;
//ALBUM_CREATED.category = ALBUM_BASE.category;
//ALBUM_CREATED.addDate = ALBUM_BASE.addDate;

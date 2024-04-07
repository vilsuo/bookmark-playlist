import { DeepPartial } from 'typeorm';
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

export const createAlbum = (obj: DeepPartial<Album>) => {
  const { id, videoId, artist, title, published, category, addDate } = obj;
  const album = new Album();

  if (id !== undefined) album.id = id;
  if (videoId !== undefined) album.videoId = videoId;
  if (artist !== undefined) album.artist = artist;
  if (title !== undefined) album.title = title;
  if (published !== undefined) album.published = published;
  if (category !== undefined) album.category = category;
  if (addDate !== undefined && typeof addDate.toString === 'function') {
    album.addDate = new Date(addDate.toString());
  }
  return album;
};

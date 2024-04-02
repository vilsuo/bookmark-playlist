import { AlbumBase } from '../types';
import * as htmlParser from './htmlParser';
import * as linkParser from './linkParser';

export const createFilename = () => `bookmarks-${new Date().valueOf()}.json`;

/**
 * 
 * @param file 
 * @param field 
 * @returns 
 */
export const getAlbumBases = (file: Express.Multer.File, field: string): AlbumBase[] => {
  // convert file to string
  const fileString = file.buffer.toString();

  const folderLinks = htmlParser.createFolderLinks(fileString, field);
  return linkParser.createAlbumBases(folderLinks);
};

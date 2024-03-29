import * as htmlParser from '../util/htmlParser';
import * as albumService from './albumService';

export const createFilename = () => `bookmarks-${new Date().valueOf()}.json`;

/**
 * 
 * @param file 
 * @param field 
 * @returns 
 */
export const convert = (file: Express.Multer.File, field: string) => {
  // convert file to string
  const fileString = file.buffer.toString();

  // convert file string to links
  const links = htmlParser.getHeaderNextDlSiblingLinks(fileString, field);

  // convert links to albums
  const albums = albumService.createAlbumsFromLinks(links);
  
  return albums;
};

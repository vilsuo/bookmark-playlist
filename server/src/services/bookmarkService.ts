import * as htmlParser from '../util/htmlParser';
import * as linkParser from '../util/linkParser';

export const createFilename = () => `bookmarks-${new Date().valueOf()}.json`;

/**
 * 
 * @param file 
 * @param field 
 * @returns 
 */
export const getAlbums = (file: Express.Multer.File, field: string) => {
  // convert file to string
  const fileString = file.buffer.toString();

  // convert file string to links
  const links = htmlParser.getHeaderNextDlSiblingLinks(fileString, field);

  // convert links to albums
  return linkParser.createAlbumsFromLinks(links);
};

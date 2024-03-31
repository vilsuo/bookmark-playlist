import { FolderLinkError } from '../errors';
import { AlbumBase, FolderLink } from '../types';

/**
 *
 * @param epoch Unix epoch time
 * @returns
 */
export const convertEpoch = (epoch: number) => new Date(epoch * 1000);

const getVideoId = (href: string | undefined): string => {
  const HREF_PREFIX = 'https://www.youtube.com/watch?v=';
  const VIDEO_ID_LENGTH = 11;

  if (!href) {
    throw new Error('Link href attribute is missing');
  }

  if (!href.startsWith(HREF_PREFIX)) {
    throw new Error('Link href attribute is not youtube');
  }

  if (href.length < HREF_PREFIX.length + VIDEO_ID_LENGTH) {
    throw new Error('Link href attribute is too short');
  }

  return href.substring(
    HREF_PREFIX.length,
    HREF_PREFIX.length + VIDEO_ID_LENGTH,
  );
};

const getAddDate = (addDate: string | undefined): Date => {
  if (!addDate) {
    throw new Error('Link add_date attribute is missing');
  }

  const utcSeconds = Number(addDate);
  if (isNaN(utcSeconds)) {
    throw new Error('Link add date is not a valid number');
  }

  return convertEpoch(utcSeconds);
};

/**
 * /^(artist) - (title) \((published)\)$/
 *
 * @param text
 * @returns
 */
const getTextContentDetails = (text: string) => {
  const ARTIST_TITLE_SEPARATOR = ' - ';
  const PUBLISHED_PATTERN = / \((\d{4})\)$/g;

  const first = text.split(ARTIST_TITLE_SEPARATOR);
  if (first.length !== 2) {
    throw new Error(
      `The artist and album must be separated with a single '${ARTIST_TITLE_SEPARATOR}' in the text content`,
    );
  }

  const second = first[1].split(PUBLISHED_PATTERN);
  if (second.length !== 3) {
    throw new Error(
      `The text content must end to four figure publish year in parenthesis`,
    );
  }

  const published = Number(second[1]);
  if (isNaN(published)) {
    throw new Error('The publish year in the text content is not a number');
  }

  return {
    artist: first[0],
    title: second[0],
    published,
  };
};

export const createAlbumBases = (folderLinks: FolderLink[]): AlbumBase[] => {
  return folderLinks.map((folderLink) => {
    const { text, href, folder, addDate } = folderLink;

    try {
      return {
        videoId: getVideoId(href),
        ...getTextContentDetails(text.trim()),
        category: folder.trim(),
        addDate: getAddDate(addDate),
      };

    } catch (error: unknown) {
      let message = 'Unknown error happened';
      if (error instanceof Error) {
        message = error.message;
      }
      throw new FolderLinkError(message, folderLink);
    }
  });
};

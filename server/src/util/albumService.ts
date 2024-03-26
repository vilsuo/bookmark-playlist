import { RawLinkError } from '../errors';
import { Album, CategoryLink } from '../types';

/**
 *
 * @param epoch Unix epoch time
 * @returns
 */
export const convertEpoch = (epoch: number) => new Date(epoch * 1000);

const getVideoId = (href: string | undefined): string => {
  const VIDEO_PREFIX = 'https://www.youtube.com/watch?v=';
  const VIDEO_ID_LENGTH = 11;

  if (!href) {
    throw new Error('Link href attribute is missing');
  }

  if (!href.startsWith(VIDEO_PREFIX)) {
    throw new Error('Link href attribute is not youtube');
  }

  if (href.length < VIDEO_PREFIX.length + VIDEO_ID_LENGTH) {
    throw new Error('Link href attribute is too short');
  }

  return href.substring(
    VIDEO_PREFIX.length,
    VIDEO_PREFIX.length + VIDEO_ID_LENGTH,
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
 * @param linkTitle
 * @returns
 */
const getTitleDetails = (linkTitle: string) => {
  const ARTIST_TITLE_SEPARATOR = ' - ';
  const PUBLISHED_PATTERN = / \((\d{4})\)$/g;

  const first = linkTitle.split(ARTIST_TITLE_SEPARATOR);
  if (first.length !== 2) {
    throw new Error(
      `The artist and album must be separated with a single '${ARTIST_TITLE_SEPARATOR}' in the title`,
    );
  }

  const second = first[1].split(PUBLISHED_PATTERN);
  if (second.length !== 3) {
    throw new Error(
      `The title must end to four figure publish year in parenthesis`,
    );
  }

  const published = Number(second[1]);
  if (isNaN(published)) {
    throw new Error('The publish year in the title is not a number');
  }

  return {
    artist: first[0],
    title: second[0],
    published,
  };
};

export const createAlbumsFromLinks = (links: CategoryLink[]): Album[] => {
  return links.map((link) => {
    const { title, href, category, addDate } = link;

    try {
      return {
        category,
        videoId: getVideoId(href),
        addDate: getAddDate(addDate),
        ...getTitleDetails(title.trim()),
      };
    } catch (error: unknown) {
      let message = 'Unknown error happened';
      if (error instanceof Error) {
        message = error.message;
      }
      throw new RawLinkError(message, link);
    }
  });
};

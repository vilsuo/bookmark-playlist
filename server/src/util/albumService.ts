import { LinkError } from '../errors';
import { Link } from '../types';

const getVideoId = (href: string | undefined): string => {
  const VIDEO_PREFIX = 'https://www.youtube.com/watch?v=';
  const VIDEO_ID_LENGTH = 11;

  if (!href) {
    throw new Error('Link href attribute is missing');
  }

  if (!href.startsWith(VIDEO_PREFIX)) {
    throw new Error('Link href attibute is not youtube');
  }

  if (href.length < VIDEO_PREFIX.length + VIDEO_ID_LENGTH) {
    throw new Error('Link href attribute is too short');
  }

  return href.substring(
    VIDEO_PREFIX.length,
    VIDEO_PREFIX.length + VIDEO_ID_LENGTH,
  );
};

/**
 * /^(artist) - (title) \((published)\)$/
 *
 * @param linkTitle
 * @returns
 */
const getLinkDetails = (linkTitle: string) => {
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
    throw new Error(`The title must end to four figure publish year in parenthesis`);
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

export const createAlbumsFromLinks = (links: Link[]) => {
  return links.map((link) => {
    const { title, href } = link;

    try {
      return {
        category: link.category,
        videoId: getVideoId(href),
        ...getLinkDetails(title.trim()),
      };
    } catch (error: unknown) {
      let message = 'Unknown error happened';
      if (error instanceof Error) {
        message = error.message;
      }
      throw new LinkError(message, link);
    }
  });
};

import { Link } from '../types';

const getVideoId = (href: string | undefined): string => {
  const VIDEO_PREFIX = 'https://www.youtube.com/watch?v=';
  const VIDEO_ID_LENGTH = 11;

  if (!href) {
    throw new Error('Hyperref is missing');
  }

  if (!href.startsWith(VIDEO_PREFIX)) {
    throw new Error('Hyperref does not have youtube prefix');
  }

  if (href.length < VIDEO_PREFIX.length + VIDEO_ID_LENGTH) {
    throw new Error('Hyperref is too short');
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
      `Title must have a single '${ARTIST_TITLE_SEPARATOR}' separator`,
    );
  }

  const second = first[1].split(PUBLISHED_PATTERN);
  if (second.length !== 3) {
    throw new Error(`Title must end to '${PUBLISHED_PATTERN}'`);
  }

  return {
    artist: first[0],
    title: second[0],
    published: Number(second[1]),
  };
};

export const createAlbumsFromLinks = (links: Array<Link>) => {
  return links.map((link) => {
    const { title, href } = link;

    return {
      videoId: getVideoId(href),
      ...getLinkDetails(title),
    };
  });
};

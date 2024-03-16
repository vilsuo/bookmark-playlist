import express, { NextFunction, Request, Response } from 'express';

import * as linkParser from '../util/linkParser';
import { singleUpload } from '../util/fileUpload';

const router = express();


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
    VIDEO_PREFIX.length + VIDEO_ID_LENGTH
  );
};

type Details = {
  artist: string;
  title: string;
  published: number;
};

/**
 * /^(artist) - (title) \((published)\)$/
 * 
 * @param linkTitle 
 * @returns 
 */
const getAlbumDetails = (linkTitle: string): Details => {
  const ARTIST_TITLE_SEPARATOR = ' - ';
  const PUBLISHED_PATTERN = / \((\d{4})\)$/g;

  const first = linkTitle.split(ARTIST_TITLE_SEPARATOR);
  if (first.length !== 2) {
    throw new Error(`Title must have a single '${ARTIST_TITLE_SEPARATOR}' separator`);
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

type Link = {
  title: string;
  href: undefined | string;
};

const createAlbumsFromLinks = (links: Array<Link>) => {
  return links.map((link) => {
    const { title, href } = link;
  
    return {
      videoId: getVideoId(href),
      ...getAlbumDetails(title),
    };
  });
};

// TODO
// - specify header in formData fields
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  singleUpload(req, res, async (uploadError: unknown) => {
    if (uploadError) return next(uploadError);

    const { file, body: fields } = req;

    console.log('file:    ', file);
    console.log('fields:  ', fields);

    if (!file) {
      return res.status(400).send({ message: 'file is missing' });
    }

    try {
      // convert file to string
      const fileString = file.buffer.toString();

      // convert file string to links
      const links = linkParser.getHeaderNextDlSiblingLinks(fileString, 'music');

      return res.status(201).send(createAlbumsFromLinks(links));
    } catch (error) {
      console.log('Error', error);
      next(error);
    }
  });
});

export default router;

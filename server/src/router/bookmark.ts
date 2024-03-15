import express, { NextFunction, Request, Response } from 'express';

import * as linkParser from '../util/linkParser';
import { singleUpload } from '../util/fileUpload';

const router = express();

type Link = {
  title: string;
  href: undefined | string;
};

const createAlbumsFromLinks = (links: Array<Link>) => {
  const VIDEO_ID_LENGTH = 11;
  const VIDEO_PREFIX = 'https://www.youtube.com/watch?v=';

  //const pattern = new RegExp(`?v=(.${VIDEO_ID_LENGTH})`);
  return links.map((link) => {
    const { title, href } = link;
    if (!href || !href.startsWith(VIDEO_PREFIX) || href.length < VIDEO_PREFIX.length + VIDEO_ID_LENGTH) {
      throw new Error('Link has an incorrect href');
    }

    const videoId = href.substring(VIDEO_PREFIX.length, VIDEO_PREFIX.length + VIDEO_ID_LENGTH);

    // artist - title (published)
    const parts = title.split(' - ');
    if (parts.length !== 2) {
      throw new Error('Title does not have artist/title separator');
    }

    const otherParts = parts[1].split('(');
    if (otherParts[1].length < 4 || isNaN(Number(otherParts[1].substring(0, 4)))) {
      throw new Error('Invalid year');
    }

    return {
      videoId,
      artist: parts[0].trim(),
      title: otherParts[0].trim(),
      published: Number(otherParts[1].substring(0, 4)),
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

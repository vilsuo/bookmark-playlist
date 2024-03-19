import express, { NextFunction, Request, Response } from 'express';

import { singleUpload } from '../util/fileUpload';
import * as htmlParser from '../util/htmlParser';
import * as albumService from '../util/albumService';

const router = express();

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
      const links = htmlParser.getHeaderNextDlSiblingLinks(fileString, fields.name);

      // convert links to albums
      const albums = albumService.createAlbumsFromLinks(links);

      return res.status(201).send(albums);
    } catch (error) {
      console.log('Error', error);
      next(error);
    }
  });
});

export default router;

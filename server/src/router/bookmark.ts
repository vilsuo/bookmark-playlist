import express, { NextFunction, Request, Response } from 'express';

import * as linkParser from '../util/linkParser';
import { singleUpload } from '../util/fileUpload';

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

      const links = linkParser.getHeaderNextDlSiblingLinks(fileString, 'music');
      return res.status(201).send(links);
    } catch (error) {
      console.log('Error', error);
      next(error);
    }
  });
});

export default router;

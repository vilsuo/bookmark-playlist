import express, { Request, Response } from 'express';

import { FIELD_NAME, singleUpload } from '../util/fileUpload';
import * as bookmarkService from '../services/bookmarkService';

const router = express();

router.post('/', singleUpload, async (req: Request, res: Response) => {
  const { file, body: fields } = req;

  console.log('file:    ', file);
  console.log('fields:  ', fields);

  if (!file) {
    return res.status(400).send({ message: 'File is missing' });
  }

  const field = fields[FIELD_NAME];
  if (!field) {
    return res.status(400).send({ message: 'Field is missing' });
  }

  const albums = bookmarkService.getAlbums(file, field);

  return res
    .setHeader(
      'Content-Disposition',
      `attachment; filename="${bookmarkService.createFilename()}"`
    )
    .status(201)
    .send(albums);
});

export default router;

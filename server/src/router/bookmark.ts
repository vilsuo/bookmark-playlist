import express, { Request, Response } from 'express';

import { singleUpload } from '../util/fileUpload';
import * as htmlParser from '../util/htmlParser';
import * as albumService from '../util/albumService';

const router = express();

router.post('/', singleUpload, async (req: Request, res: Response) => {
  const { file, body: fields } = req;

  console.log('file:    ', file);
  console.log('fields:  ', fields);

  if (!file) {
    return res.status(400).send({ message: 'file is missing' });
  }

  // convert file to string
  const fileString = file.buffer.toString();

  // convert file string to links
  const links = htmlParser.getHeaderNextDlSiblingLinks(fileString, fields.name);

  // convert links to albums
  const albums = albumService.createAlbumsFromLinks(links);

  return res.status(201).send(albums);
});

export default router;

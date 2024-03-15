import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import * as linkParser from './util/linkParser';
import { singleUpload } from './util/fileUpload';

const app = express();

const router = express();

// TODO
// - move 'fullpath' to other file
router.post('/bookmark', async (req: Request, res: Response, next: NextFunction) => {
  singleUpload(req, res, async (uploadError: unknown) => {
    if (uploadError) return next(uploadError);

    const { file, body: fields } = req;

    console.log('file:    ', file);
    console.log('fields:  ', fields);

    if (!file) {
      return res.status(400).send({ message: 'file is missing' });
    }

    try {
      const fullpath = path.join(__dirname, '..', file.destination, file.filename);
      const html = fs.readFileSync(fullpath).toString();
      
      const links = linkParser.getHeaderNextDlSiblingLinks(html, 'music');
      return res.status(201).send(links);  

    } catch (error) {
      console.log('Error', error);
      next(error);
    }
  });
});

app.use(express.json());

app.use('/api', router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import * as htmlParser from 'node-html-parser';

import { singleUpload } from './fileUpload';

const app = express();

const router = express();

const TAG_START = '<DL>';
const TAG_END = '</DL>';

// TODO
// - find out the tag from looking at the string
const getHtmlBlockByHeader = (htmlString: string, name: string) => {
  const opened = [];
  const closed = [];

  const headerRegex = new RegExp(`>${name}</[h|H][1-6]>`);

  const start = htmlString.search(headerRegex);

  let current = start;
  while (true) {
    if (htmlString.at(current) === '<') {
      const subs = htmlString.substring(current, current + Math.max(TAG_START.length, TAG_END.length));
      if (subs.startsWith(TAG_START)) {
        opened.push(current);
        //current =+ tagStart.length - 1;
      } else if (subs.startsWith(TAG_END)) {
        closed.push(current);
        //current =+ tagEnd.length - 1;
      }
    }
    if (opened.length > 0 && opened.length === closed.length) {
      break;
    }

    if (current >= htmlString.length) {
      throw new Error('final closing tag is not found');
    }
    current++;
  }

  return htmlParser.parse(htmlString.substring(
    opened[0],
    closed[closed.length - 1] + TAG_END.length
  ));
};

const getLinksFromBlock = (htmlBlock: htmlParser.HTMLElement) => {
  const links = htmlBlock.querySelectorAll('a');

  return links.map(link => ({
    title: link.textContent,
    href: link.getAttribute('href'),
  }));
};

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
      
      const htmlBLock = getHtmlBlockByHeader(html, 'music');
      const links = getLinksFromBlock(htmlBLock);

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

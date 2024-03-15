const express = require('express');
const path = require('path');
const fs = require('fs');
const htmlParser = require('node-html-parser');

const fileStorage = require('./fileStorage');

const app = express();

const router = express();

const fileUpload = fileStorage.upload.single('file');

const TAG_START = '<DL>';
const TAG_END = '</DL>';

const getHtmlBlockByHeader = (html, name) => {
  const opened = [];
  const closed = [];

  const headerRegex = new RegExp(`>${name}<\/[h|H][1-6]>`);

  const start = html.search(headerRegex);

  //const start = html.indexOf(`>${name}</h`);
  let current = start;
  while (true) {
    if (html.at(current) === '<') {
      const subs = html.substring(current, current + Math.max(TAG_START.length, TAG_END.length));
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

    if (current >= html.length) {
      throw new Error('final closing tag is not found');
    }
    current++;
  }

  return htmlParser.parse(html.substring(
    opened[0],
    closed[closed.length - 1] + TAG_END.length
  ));
};

const getLinksFromBlock = (htmlBlock) => {
  const links = htmlBlock.querySelectorAll('a');

  return links.map(link => ({
    title: link.textContent,
    href: link.getAttribute('href'),
  }));
};

router.post('/bookmark', async (req, res, next) => {
  fileUpload(req, res, async (uploadError) => {
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
      const links = getLinksFromBlock(htmlBLock)

      return res.status(201).send(links);  

    } catch (error) {
      console.log('Error', error)
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

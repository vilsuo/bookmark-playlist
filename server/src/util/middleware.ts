import { ErrorRequestHandler, RequestHandler } from 'express';
import { FolderLinkError } from '../errors';
import { FolderLink } from '../types';

const folderLinkToString = (folderLink: FolderLink) => {
  const { href, text, addDate } = folderLink;
  return (
    '{ text: ' +
    text +
    ', attr: { href: ' +
    href +
    ', add_date: ' +
    addDate +
    '} }'
  );
};

export const requestLogger: RequestHandler = (req, _res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Query: ', req.query);
  console.log('Body:  ', req.body);
  console.log('---');

  return next();
};

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req,
  res,
  _next,
) => {
  console.log('Error handler', error);

  const { message } = error;

  if (error instanceof FolderLinkError) {
    return res.status(400).send({
      message: message + ': ' + folderLinkToString(error.folderLink),
    });
  }

  return res.status(400).send({ message });
};

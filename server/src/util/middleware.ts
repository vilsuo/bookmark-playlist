import { ErrorRequestHandler, RequestHandler } from 'express';
import { AlbumValidationError, FolderLinkError } from '../errors';

export const requestLogger: RequestHandler = (req, _res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Query: ', req.query);
  console.log('Body:  ', req.body);
  console.log('---');

  return next();
};

export const errorHandler: ErrorRequestHandler = (error: Error, _req, res, _next) => {
  console.log('Error handler', error);

  const { message } = error;

  if (error instanceof FolderLinkError) {
    console.log('folder link error handler');
    return res.status(400).send({
      message: `${message}: ${error.getDetails()}`,
    });
  } else if (error instanceof AlbumValidationError) {
    console.log('entity validation error middleware');
    return res.status(400).send({
      message: `${message}: ${error.getDetails()}`,
    })
  }

  return res.status(400).send({ message });
};

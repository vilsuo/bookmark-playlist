import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { RawLinkError } from '../errors';
import { RawLink } from '../types';

const rawLinkToString = (rawLink: RawLink) => {
  const { href, title, addDate } = rawLink;
  return (
    '{ title: ' +
    title +
    ', attr: { href: ' +
    href +
    ', add_date: ' +
    addDate +
    '} }'
  );
};

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
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

  if (error instanceof RawLinkError) {
    return res.status(400).send({
      message: message + ': ' + rawLinkToString(error.rawLink),
    });
  }

  return res.status(400).send({ message });
};

import { ErrorRequestHandler } from 'express';
import { LinkError } from '../errors';
import { Link } from '../types';

const linkToString = (link: Link) => {
  const { href, title } = link;
  return '{ href: ' + href + ', title: ' + title + ' }';
};

export const errorHandler: ErrorRequestHandler = (error: Error, _req, res, _next) => {
  console.log('Error handler', error);

  const { message } = error;

  if (error instanceof LinkError) {
    return res.status(400).send({
      message: message + ': ' + linkToString(error.link),
    });
  }

  return res.status(400).send({ message });
};

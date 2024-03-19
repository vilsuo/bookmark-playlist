import { ErrorRequestHandler } from 'express';
import { LinkError } from '../errors';

export const errorHandler: ErrorRequestHandler = (error: Error, _req, res, _next) => {
  console.log('Error handler', error);

  const { message } = error;

  if (error instanceof LinkError) {
    return res.status(400).send({
      message: message + ': ' + JSON.stringify(error.link),
    });
  }

  return res.status(400).send({ message });
};

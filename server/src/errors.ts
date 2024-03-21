import { RawLink } from './types';

export class RawLinkError extends Error {
  rawLink: RawLink;

  constructor(message: string, rawLink: RawLink) {
    super(message);
    this.name = 'LinkError';
    this.rawLink = rawLink;
  }
}

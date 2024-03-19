import { Link } from './types';

export class LinkError extends Error {
  link: Link;

  constructor(message: string, link: Link) {
    super(message);
    this.name = 'LinkError';
    this.link = link;
  }
}

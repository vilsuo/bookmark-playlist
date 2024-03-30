import { FolderLink } from './types';

export class FolderLinkError extends Error {
  folderLink: FolderLink;

  constructor(message: string, folderLink: FolderLink) {
    super(message);
    this.name = 'LinkError';
    this.folderLink = folderLink;
  }
}

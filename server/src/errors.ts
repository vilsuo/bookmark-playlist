import { ValidationError } from 'class-validator';
import { FolderLink } from './types';
import { Album } from './album/album.entity';

export class FolderLinkError extends Error {
  folderLink: FolderLink;

  constructor(message: string, folderLink: FolderLink) {
    super(message);
    this.name = 'LinkError';
    this.folderLink = folderLink;
  }

  getDetails() {
    const { href, text, addDate, folder } = this.folderLink;
    const textContent = `text content: '${text}'`;
    const attributes = `attributes href '${href}' and add_date: '${addDate}'`;
    return `link in the folder '${folder}' with a ${textContent} and ${attributes}`;
  }
}

type AlbumValidationErrorItem = {
  target: Album;
  property: string;
  value: any;
  constraints: string[] | undefined;
};

/**
 * Expects all validation errors to originate from a single {@link Album}
 * validation error.
 */
export class AlbumValidationError extends Error {
  items: AlbumValidationErrorItem[];

  constructor(validationErrors: ValidationError[]) {
    super('Album validation failed');
    this.name = 'AlbumValidationError';

    this.items = validationErrors.map((error) => ({
      target: error.target as Album,
      property: error.property,
      value: error.value,
      constraints: error.constraints
        ? Object.values(error.constraints)
        : undefined,
    }));
  }

  getDetails() {
    const album = this.items[0].target;
    const albumString = `album with artist '${album.artist}' and title '${album.title}'`;

    const messages = this.items.map((item) => {
      let message = `invalid value '${item.value}' in property '${item.property}'`;
      if (item.constraints) {
        message += ': ' + item.constraints.join(', ');
      }
      return message;
    });

    return `${albumString}: ${messages.join(', ')}`;
  }
}

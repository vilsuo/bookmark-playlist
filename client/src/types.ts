
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum AlbumColumn {
  ARTIST = 'Artist',
  ALBUM = 'Title',
  PUBLISHED = 'Year',
}

export type Interval = {
  start: string;
  end: string;
}

export enum Order {
  DESC = -1, // largest to smallest
  ASC = 1,  // smallest to largest
}

export type LinkBase = {
  text: string;
  href: string;
};

export type Link = LinkBase & {
  imageSrc?: string;
  className?: string;
}

// ENTITIES
export type Album = {
  videoId: string;
  artist: string;
  title: string;
  published: number;
  category: string;
  addDate: string;
};

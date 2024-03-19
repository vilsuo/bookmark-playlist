
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
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
};

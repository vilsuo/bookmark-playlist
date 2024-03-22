export type RawLink = {
  title: string;
  href: string | undefined;
  addDate: string | undefined;
};

export type CategoryLink = RawLink & {
  category: string;
};

export type Album = {
  videoId: string;
  artist: string;
  title: string;
  published: number;
  category: string;
  addDate: Date;
};

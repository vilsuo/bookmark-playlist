export type RawLink = {
  title: string;
  href: string | undefined;
  category: string;
  addDate: string | undefined;
};

export type Album = {
  videoId: string;
  artist: string;
  title: string;
  published: number;
  category: string;
  addDate: Date;
};

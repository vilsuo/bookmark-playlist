import { Album } from '../types';

type Attributes = Record<string, string | number | boolean>;

const toQueryString = (value: string) => value.replace(' ', '+');

const createQueryString = (attributes: Attributes) => {
  return Object.keys(attributes)
    .map((attr) => `${attr}=${attributes[attr]}`)
    .join('&');
};

export const getArtistSearchLink = (album: Album) => {
  const attributes = {
    searchString: toQueryString(album.artist),
    type: 'band_name',
  };

  const query = createQueryString(attributes);

  return `https://www.metal-archives.com/search?${query}`;
};

export const getAlbumSearchLink = (album: Album) => {
  const attributes = {
    bandName: toQueryString(album.artist),
    releaseTitle: toQueryString(album.title),
  };

  const query = createQueryString(attributes);

  return `https://www.metal-archives.com/search/advanced/searching/albums?${query}`;
};

// export const getYoutubeEmbedLink = (videoId: Album['videoId'], attributes: Attributes) => {
//   return `https://www.youtube.com/embed/${videoId}?${createQueryString(attributes)}`
// };

export const getYoutubeSearchLink = (album: Album) => {
  const queryString = toQueryString(`${album.artist} ${album.title}`);
  return `https://www.youtube.com/results?search_query=${queryString}`;
};

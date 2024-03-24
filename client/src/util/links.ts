import { Album } from '../types';

const toSearchString = (value: string) => value.replace(' ', '+');

export const getArtistSearchLink = (album: Album) => {
  const artistSearchString = toSearchString(album.artist);
  return `https://www.metal-archives.com/search?searchString=${artistSearchString}&type=band_name`;
};

export const getAlbumSearchLink = (album: Album) => {
  const artistSearchString = toSearchString(album.artist);
  const titleSearchString = toSearchString(album.title);
  return `https://www.metal-archives.com/search/advanced/searching/albums?bandName=${artistSearchString}&releaseTitle=${titleSearchString}`;
};

import axios from 'axios';
import { Album, AlbumCreation } from '../types';

const BASE_URL = '/api/albums';

export const getAlbums = async (): Promise<Album[]> => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

export const create = async (values: AlbumCreation): Promise<Album> => {
  const { data } = await axios.post(BASE_URL, values);
  return data;
};

export const update = async (album: Album): Promise<Album> => {
  const { data } = await axios.put(`${BASE_URL}/${album.id}`, album);
  return data;
};

export const remove = async (id: Album['id']): Promise<Album['id']> => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
};

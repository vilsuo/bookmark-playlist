import axios from 'axios';
import { Album, AlbumCreation, AlbumUpdate } from '../types';

const BASE_URL = '/api/albums';

export const getAlbums = async (): Promise<Album[]> => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

export const create = async (values: AlbumCreation): Promise<Album> => {
  const { data } = await axios.post(BASE_URL, values);
  return data;
};

export const update = async (id: Album["id"], values: AlbumUpdate)
: Promise<Album> => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, values);
  return data;
};

export const remove = async (id: Album['id']): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

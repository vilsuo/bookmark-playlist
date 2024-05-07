import axios from 'axios';
import { Album, AlbumCreation } from '../types';

const BASE_URL = '/api/albums';

export const getAlbums = async () => {
  return await axios.get(BASE_URL);
};

export const create = async (values: AlbumCreation) => {
  const { data } = await axios.post(BASE_URL, values);
  return data;
};

export const update = async (album: Album) => {
  const { data } = await axios.put(`${BASE_URL}/${album.id}`, album);
  return data;
};

export const remove = async (id: Album['id']) => axios.delete(`${BASE_URL}/${id}`);

import axios from 'axios';
import { Album } from '../types';

const BASE_URL = '/api/albums';

export const getAlbums = async () => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

export const update = async (album: Album) => {
  const { data } = await axios.put(`${BASE_URL}/${album.id}`, album);
  return data;
};

export const remove = async (id: Album['id']) => axios.delete(`${BASE_URL}/${id}`);

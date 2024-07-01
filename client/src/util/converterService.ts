import axios from 'axios';
import { Album } from '../types';

export const BASE_URL = '/api/bookmark';

export const convertBookmarks = async (formData: FormData): Promise<Album[]> => {
  const { data } = await axios.post(BASE_URL, formData);
  return data;
};

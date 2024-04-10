import axios from 'axios';

const BASE_URL = '/api/albums';

export const getAlbums = async () => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

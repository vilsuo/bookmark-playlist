import axios from 'axios';

const BASE_URL = '/api';
//const BASE_URL = 'http://server:3000/api';

export const createAlbums = async (formData: FormData) => {
  const { data } = await axios.post(`${BASE_URL}/bookmark`, formData);
  return data;
};

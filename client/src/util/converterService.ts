import axios from 'axios';

export const BASE_URL = '/api/bookmark';

export const convertBookmarks = async (formData: FormData) => {
  return await axios.post(BASE_URL, formData);
};

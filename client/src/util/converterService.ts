import axios from 'axios';
import fileDownload from 'js-file-download';

const BASE_URL = '/api/bookmark';

const convertBookmarks = async (formData: FormData) => {
  return await axios.post(BASE_URL, formData, 
    { responseType: 'blob' }
  );
};

export const downloadBookmarks = async (formData: FormData) => {
  const response = await convertBookmarks(formData);

  const header = response.headers['content-disposition'];
  const match = header.match(/filename="(\w+-\d+.json)"/);
  const filename = match ? match[1] : 'albums.json';

  fileDownload(response.data, filename);
};

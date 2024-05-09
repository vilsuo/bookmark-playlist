import axios from 'axios';
import fileDownload from 'js-file-download';

const BASE_URL = '/api/albums/download';

export const downloadAlbums = async () => {
  const response = await axios.get(BASE_URL, 
    { responseType: 'blob' }
  );

  const header = response.headers['content-disposition'];
  const match = header.match(/filename="(\w+-\d+.json)"/);
  const filename = match ? match[1] : 'albums.json';

  fileDownload(response.data, filename);
};

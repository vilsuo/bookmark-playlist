import * as downloadService from '../../../util/downloadService';

const AlbumDownloader = () => {

  const handleDownload = async () => {
    await downloadService.downloadAlbums();
  };

  return (
    <div>
      <h3>Download Albums data</h3>
      <p className="info">
        Download all albums as JSON
      </p>

      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default AlbumDownloader;

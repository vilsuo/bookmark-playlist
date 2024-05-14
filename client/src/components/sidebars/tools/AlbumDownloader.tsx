import * as downloadService from '../../../util/downloadService';

const AlbumDownloader = () => {

  const handleDownload = async () => {
    await downloadService.downloadAlbums();
  };

  return (
    <div className="album-downloader">
      <p className="info">
        Download albums in JSON-format
      </p>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default AlbumDownloader;

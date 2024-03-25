import { Album } from "../../types";
import { getAlbumSearchLink, getArtistSearchLink } from "../../util/links";
import AlbumChips from "../album/AlbumChips";
import { MaLink } from "../general/Links";

interface VideoDetailsProps {
  album: Album;
};

const VideoDetails = ({ album }: VideoDetailsProps) => {
  return (
    <div className="video-details">
      <AlbumChips album={album} />

      <div className="content">
        <div className="links">
          <MaLink
            link={{ text: album.artist, href: getArtistSearchLink(album) }}
          />
          <MaLink
            link={{ text: album.title, href: getAlbumSearchLink(album) }}
          />
        </div>
        
      </div>
    </div>
  );
};

export default VideoDetails;

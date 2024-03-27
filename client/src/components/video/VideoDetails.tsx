import { Album } from "../../types";
import { toDateString } from "../../util/dateConverter";
import { getAlbumSearchLink, getArtistSearchLink } from "../../util/links";
import { MaLink } from "../general/Links";
import Chip from "./Chip";

interface VideoDetailsProps {
  album: Album;
};

const VideoDetails = ({ album }: VideoDetailsProps) => {
  return (
    <div className="video-details">
      <Chip 
        className="category" text="Category" value={album.category}
      />

      <Chip 
        className="add-date" text="Added" value={toDateString(album.addDate)}
      />

      <MaLink
        link={{ text: album.artist, href: getArtistSearchLink(album) }}
      />
      <MaLink
        link={{ text: album.title, href: getAlbumSearchLink(album) }}
      />
    </div>
  );
};

export default VideoDetails;

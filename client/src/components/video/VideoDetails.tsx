import { Album } from "../../types";
import { toLocaleDateString } from "../../util/dateConverter";
import { getAlbumSearchLink, getArtistSearchLink, getYoutubeSearchLink } from "../../util/links";
import { MaLink, YtLink } from "../general/Links";
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
        className="add-date" text="Added" value={toLocaleDateString(album.addDate)}
      />

      <MaLink
        link={{ text: album.artist, href: getArtistSearchLink(album) }}
      />
      <MaLink
        link={{ text: album.title, href: getAlbumSearchLink(album) }}
      />

      <YtLink
        link={{ text: "Search", href: getYoutubeSearchLink(album) }}
      />
    </div>
  );
};

export default VideoDetails;

import { useState } from 'react';
import { Album, Link } from '../../types';
import { useComponentVisible } from '../../util/hooks';

interface MenuContextProps {
  text: string;
  links: Array<Link>;
}

const MenuContext = ({ text, links }: MenuContextProps) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  const [points, setPoints] = useState({ x: 0, y: 0 });

  return (
    <div ref={ref}>
      <div
        onClick={(e) => {
          setIsComponentVisible(!isComponentVisible);
          setPoints({ x: e.pageX, y: e.pageY });
        }}
      >
        {text}
      </div>

      {isComponentVisible && (
        <div className='menu-context-context'>
          <ul style={{ top: points.y, left: points.x }}>
            {links.map((link, idx) => (
              <li key={idx}>
                <a
                  onClick={() => setIsComponentVisible(false)}
                  href={link.href}
                  target='_blank'
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface AlbumRowProps {
  album: Album;
  className: string;
  select: (album: Album) => void;
}

const AlbumRow = ({ album, className, select }: AlbumRowProps) => {

  const artistSearchString = album.artist.replace(' ', '+');
  const titleSearchString = album.title.replace(' ', '+');

  const getArtistSearchLink = () => {
    return {
      text: album.artist,
      href: `https://www.metal-archives.com/search?searchString=${artistSearchString}&type=band_name`
    }
  };

  const getAlbumSearchLink = () => {
    return {
      text: album.title,
      href: `https://www.metal-archives.com/search/advanced/searching/albums?bandName=${artistSearchString}&releaseTitle=${titleSearchString}`,
    }
  };

  return (
    <tr className={className}>
      <td onClick={() => select(album)}>Play</td>

      <td>
        <MenuContext
          text={album.artist}
          links={[getArtistSearchLink()]}
        />
      </td>

      <td>
        <MenuContext
          text={album.title}
          links={[getAlbumSearchLink()]}
        />
      </td>
      <td>{album.published}</td>
    </tr>
  );
};

export default AlbumRow;

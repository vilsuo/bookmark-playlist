import { useState } from 'react';
import { Album, Link } from '../../types';
import { useComponentVisible } from '../../util/hooks';

interface ActionLinkProps {
  link: Link;
  onClick: () => void;
}

const ActionLink = ({ link, onClick }: ActionLinkProps) => (
  <a
    onClick={onClick}
    target='_blank' // to open in a new tab
    href={link.href}
  >
    {link.text}
  </a>
);

interface DropdownProps {
  children: string | JSX.Element;
  items: Link[];
}

const Dropdown = ({ children, items }: DropdownProps) => {
  // outside clicks
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  // remember click location
  const [points, setPoints] = useState({ x: 0, y: 0 });

  return (
    <div ref={ref}>
      <div
        onClick={(e) => {
          setIsComponentVisible(!isComponentVisible); // toggle context
          setPoints({ x: e.pageX, y: e.pageY });
        }}
      >
        {children}
      </div>

      {isComponentVisible && (
        <div className='dropdown-context'
          style={{ top: points.y + 5, left: points.x - 5 }}
        >
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                <ActionLink
                  onClick={() => setIsComponentVisible(false)}
                  link={item}
                />
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
    const text = album.artist;
    const href = `https://www.metal-archives.com/search?searchString=${artistSearchString}&type=band_name`;
    
    return { text, href };
  };

  const getAlbumSearchLink = () => {
    const text = album.title;
    const href = `https://www.metal-archives.com/search/advanced/searching/albums?bandName=${artistSearchString}&releaseTitle=${titleSearchString}`;

    return { text, href };
  };

  return (
    <tr className={className}>
      <td onClick={() => select(album)}>Play</td>

      <td>
        <Dropdown items={[getArtistSearchLink()]}>
          {album.artist}
        </Dropdown>
      </td>

      <td>
        <Dropdown items={[getAlbumSearchLink()]}>
          {album.title}
        </Dropdown>
      </td>
      <td>{album.published}</td>
    </tr>
  );
};

export default AlbumRow;

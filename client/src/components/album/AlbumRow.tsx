import { useState } from 'react';
import { Album, Link } from '../../types';
import { useComponentVisible } from '../../util/hooks';

import ma from '../../../assets/ma.ico';

interface DropdownItemProps {
  link: Link;
  close: () => void;
}

const DropdownItem = ({ link, close }: DropdownItemProps) => {
  const { text, href, imageSrc, className } = link;
  return (
    <li className={className} onClick={close}>
      <a href={href} target='_blank'>
        { imageSrc && <img src={imageSrc} /> }
        <span>{text}</span>
      </a>
    </li>
  )
};

interface DropdownProps {
  children: string | JSX.Element;
  links: Link[];
}

const Dropdown = ({ children, links }: DropdownProps) => {
  // outside clicks
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  // remember click location
  const [points, setPoints] = useState({ x: 0, y: 0 });

  return (
    <div ref={ref}>
      <div className='dropdown-trigger'
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
            {links.map((link, idx) => (
              <DropdownItem key={idx}
                link={link}
                close={() => setIsComponentVisible(false)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface AlbumRowProps {
  album: Album;
  isSelected: boolean;
  select: (album: Album) => void;
}

const AlbumRow = ({ album, isSelected, select }: AlbumRowProps) => {

  const artistSearchString = album.artist.replace(' ', '+');
  const titleSearchString = album.title.replace(' ', '+');

  const getArtistSearchLink = (): Link => {
    const text = album.artist;
    const href = `https://www.metal-archives.com/search?searchString=${artistSearchString}&type=band_name`;
    
    return { text, href, imageSrc: ma, className: 'ma' };
  };

  const getAlbumSearchLink = (): Link => {
    const text = album.title;
    const href = `https://www.metal-archives.com/search/advanced/searching/albums?bandName=${artistSearchString}&releaseTitle=${titleSearchString}`;

    return { text, href, imageSrc: ma, className: 'ma' };
  };

  return (
    <tr>
      <td onClick={() => select(album)}>Play</td>

      <td>
        <Dropdown links={[getArtistSearchLink()]}>
          {album.artist}
        </Dropdown>
      </td>

      <td>
        <Dropdown links={[
          getAlbumSearchLink(),
          { href: 'https://google.com', text: 'Edit', className: 'ma' },
        ]}>
          {album.title}
        </Dropdown>
      </td>

      <td>{album.published}</td>
    </tr>
  );
};

export default AlbumRow;

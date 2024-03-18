import { useState } from 'react';
import { Link } from '../types';
import { useComponentVisible } from '../util/hooks';

interface DropdownItemProps {
  link: Link;
  close: () => void;
}

const DropdownItem = ({ link, close }: DropdownItemProps) => {
  const { text, href, imageSrc, className } = link;

  const handleClick = (e) => {
    e.stopPropagation();
    close();
  };

  return (
    <li className={className} onClick={handleClick}>
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
        onContextMenu={(e) => {
          e.preventDefault();
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

export default Dropdown;

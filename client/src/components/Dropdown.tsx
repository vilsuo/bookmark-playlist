import { useState } from 'react';
import { Link } from '../types';
import { useComponentVisible } from '../util/hooks';

interface DropdownLinkItemProps {
  link: Link;
  close: () => void;
}

const DropdownLinkItem = ({ link, close }: DropdownLinkItemProps) => {
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

interface DropdownActionItemProps {
  action: Action;
  close: () => void;
}

const DropdownActionItem = ({ action, close }: DropdownActionItemProps) => {
  const handleClick = (e) => {
    action.onClick();
    close();
  };

  return (
    <li>
      <button onClick={handleClick}>
        {action.text}
      </button>
    </li>
  )
};

type Action = {
  text: string;
  onClick: () => void;
};

interface DropdownProps {
  children: string | JSX.Element;
  links?: Link[];
  actions?: Action[];
}

const Dropdown = ({ children, links, actions }: DropdownProps) => {
  // outside clicks
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  // remember click location
  const [points, setPoints] = useState({ x: 0, y: 0 });

  return (
    <div ref={ref}>
      <div className='dropdown-trigger'
        onClick={() => {
          if (isComponentVisible) {
            setIsComponentVisible(false);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsComponentVisible(!isComponentVisible);
          setPoints({ x: e.pageX, y: e.pageY });
        }}
      >
        {children}
      </div>

      {isComponentVisible && (
        <div className='dropdown-context'
          style={{ top: points.y + 5, left: points.x - 5 }}
          onClick={(e) => { e.stopPropagation(); }}
        >
          <div>
            { links && (
              <ul>
                {links.map((link, idx) => (
                  <DropdownLinkItem key={idx}
                    link={link}
                    close={() => setIsComponentVisible(false)}
                  />
                ))}
              </ul>
            )}
            { actions && (
              <ul>
                {actions.map((action, idx) => (
                  <DropdownActionItem key={idx}
                    action={action}
                    close={() => setIsComponentVisible(false)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

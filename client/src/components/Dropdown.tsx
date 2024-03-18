import { useState } from 'react';
import { Link } from '../types';
import { useComponentVisible } from '../util/hooks';

interface DropdownLinkItemProps {
  links: Link[];
  close: () => void;
}

const DropdownLinkItems = ({ links, close }: DropdownLinkItemProps) => {
  return (
    <ul>
      { links.map((link, idx) => {
        const { text, href, imageSrc, className } = link;

        return (
          <li key={idx} className={className} onClick={close}>
            <a href={href} target='_blank'>
              { imageSrc && <img src={imageSrc} /> }
              <span>{text}</span>
            </a>
          </li>
        )
      })}
    </ul>
  );
};

interface DropdownActionItemProps {
  actions: Action[];
  close: () => void;
}

const DropdownActionItem = ({ actions, close }: DropdownActionItemProps) => {

  const handleClick = (onClick: () => void) => (e) => {
    onClick();
    close();
  };

  return (
    <ul>
      { actions.map((action, idx) => {
        const { onClick, text } = action;

        return (
          <li key={idx}>
            <button onClick={handleClick(onClick)}>
              {text}
            </button>
          </li>
        );
      })}
    </ul>
  );
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

  const close = () => setIsComponentVisible(false);

  return (
    <div ref={ref}>
      <div className='dropdown-trigger'
        onClick={() => {
          if (isComponentVisible) { close(); }
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
              <DropdownLinkItems links={links} close={close} />
            )}
            { actions && (
              <DropdownActionItem actions={actions} close={close} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

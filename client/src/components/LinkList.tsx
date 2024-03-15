import { Link } from '../types';

interface LinkListProps {
  links: Array<Link>;
  setCurrentLink: (link: Link) => void;
}

const LinkList = ({ links, setCurrentLink } : LinkListProps) => {

  const handleSelect = (link: Link) => {
    setCurrentLink(link);
    console.log('selected', link.title);
  };

  return (
    <div>
      <h2>Links</h2>
      <ul>
      {links.map((link) =>
        <li key={link.href}
          onClick={() => handleSelect(link)}
        >
          {link.title}
        </li>
      )}
      </ul>
    </div>
  );
};

export default LinkList;

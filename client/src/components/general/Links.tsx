// icons
import ma from '../../../assets/ma.ico';
import { LinkBase } from '../../types';

interface MaLinkProps {
  link: LinkBase;
}

export const MaLink = ({ link }: MaLinkProps) => {
  const { text, href } = link;

  return (
    <div className='ma'>
      <a href={href} target='_blank'>
        <img src={ma} />
        <span>{text}</span>
      </a>
    </div>
  );
};

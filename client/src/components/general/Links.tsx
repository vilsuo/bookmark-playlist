// icons
import ma from '../../../assets/ma.ico';
import yt from '../../../assets/yt.ico';

import { LinkBase } from '../../types';

interface LinkProps {
  link: LinkBase;
}

export const MaLink = ({ link }: LinkProps) => <ImageLink link={link} imageSrc={ma} />;

export const YtLink = ({ link }: LinkProps) => <ImageLink link={link} imageSrc={yt} />;

interface ImageLinkProps {
  link: LinkBase;
  imageSrc: string | undefined;
}

interface ImageLinkProps {
  link: LinkBase;
  imageSrc: string | undefined;
}

const ImageLink = ({ link, imageSrc }: ImageLinkProps) => {
  const { text, href } = link;

  return (
    <div className="ico">
      <a href={href} target="_blank">
        <img src={imageSrc} />
        <span>{text}</span>
      </a>
    </div>
  );
};

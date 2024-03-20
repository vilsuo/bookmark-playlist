
interface AlbumsButtonProps {
  show: () => void;
}

const AlbumsButton = ({ show }: AlbumsButtonProps) => {
  return (
    <button id='albums-button' onClick={show}>
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="14" stroke="black" strokeWidth="11" fill="none" />
        <circle cx="20" cy="20" r="2" stroke="black" fill="black" />
      </svg> 
    </button>
  );
};

export default AlbumsButton;

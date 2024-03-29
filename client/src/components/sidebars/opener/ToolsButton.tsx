interface ToolsButtonProps {
  show: () => void;
}

const ToolsButton = ({ show }: ToolsButtonProps) => {
  return (
    <button onClick={show}>
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="wrench">
            <rect width="100%" height="100%" fill="white"/>

            <circle r="8" cx="15" cy="15" fill="black"/>

            <circle
              cx="14"
              cy="14"
              r="4.5"
              fill="white"
            />
            
            <polygon 
              points="12,6, 17.0,11 11,17 6,12"
              fill="white"
            />

            <polygon
              points="22,18 32,28 28,32 18,22"
              fill="black"
            />
          </mask>
        </defs>

        <circle
          cx="20"
          cy="20"
          r="18.5"
          stroke="black"
          mask="url(#wrench)"
        />
      </svg>
    </button>
  );
};

export default ToolsButton;

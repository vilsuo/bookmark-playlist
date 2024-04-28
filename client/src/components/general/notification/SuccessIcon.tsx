
const SuccessIcon = ({ size = 1 }) => {

  const dim = 2 * 20 * size;

  return (
    <svg width={dim} height={dim} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="tick">
          <rect width="100%" height="100%" fill="white"/>

          <polygon 
            points="22,8 30,16 18,28 10,20"
            fill="black"
          />

          <polygon
            points="22,4 30,12 18,24 10,16"
            fill="white"
          />
        </mask>
      </defs>

      <circle
        cx="20"
        cy="20"
        r="20"
        fill="green"
        mask="url(#tick)"
      />
    </svg>
  );
};

export default SuccessIcon;
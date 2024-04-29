
const ErrorIcon = ({ size = 1 }) => {

  const dim = 2 * 20 * size;

  return (
    <svg width={dim} height={dim} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="excla">
          <rect width="100%" height="100%" fill="white"/>

          <rect
            x="18"
            y="10"
            width="4"
            height="14"
            rx="2"
            ry="2"
            fill="black"
          />

          <circle
            cx="20"
            cy="28"
            r="2"
            fill="black"
          />
        </mask>
      </defs>

      <circle
        cx="20"
        cy="20"
        r="20"
        fill="red"
        mask="url(#excla)"
      />
    </svg>
  );
};

export default ErrorIcon;
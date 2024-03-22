
interface TiltedRecProps {
  deg: number;
}

const TiltedRec = ({ deg }: TiltedRecProps ) => {
  return (
    <rect x="15.5" width="9" height="7" rx="2" style={{
      'transformOrigin': 'center',
      'transform': `rotate(${deg}deg)`,
    }}/>
  );
};

interface SettingsButtonProps {
  show: () => void;
}

const SettingsButton = ({ show }: SettingsButtonProps) => {
  return (
    <button id='albums-button' onClick={show}>
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="10" stroke="black" strokeWidth="9" fill="none" />

        <TiltedRec deg={0} />
        <TiltedRec deg={60} />
        <TiltedRec deg={120} />
        <TiltedRec deg={180} />
        <TiltedRec deg={240} />
        <TiltedRec deg={300} />
      </svg> 
    </button>
  );
};

export default SettingsButton;

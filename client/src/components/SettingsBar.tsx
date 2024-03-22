
interface SettingsBarProps {
  close: () => void;
}

const SettingsBar = ({ close }: SettingsBarProps) => {
  return (
    <div className=''>
      <button onClick={close}>Close</button>
    </div>
  );
};

export default SettingsBar;

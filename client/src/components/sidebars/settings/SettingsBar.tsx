
interface SettingsBarProps {
  close: () => void;
}

const SettingsBar = ({ close }: SettingsBarProps) => {
  return (
    <div className='sidebar'>
      <div className='sidebar-toolbar'>
        <h2>Settings</h2>
        <button onClick={close}>&#x2715;</button>
      </div>
    </div>
  );
};

export default SettingsBar;

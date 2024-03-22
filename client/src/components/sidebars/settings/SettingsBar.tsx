import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAutoplay, toggleAutoplay } from '../../../redux/reducers/settingsSlice';

interface SettingsBarProps {
  close: () => void;
}

const SettingsBar = ({ close }: SettingsBarProps) => {
  const dispatch = useAppDispatch()
  const autoplay = useAppSelector(state => selectAutoplay(state));

  return (
    <div className='sidebar'>
      <div className='sidebar-toolbar'>
        <h2>Settings</h2>
        <button onClick={close}>&#x2715;</button>
      </div>

      <div className='sidebar-container'>
        <button
          onClick={() => dispatch(toggleAutoplay())}
        >
          { autoplay ? 'Disable' : 'Enable' } autoplay
        </button>
      </div>
    </div>
  );
};

export default SettingsBar;

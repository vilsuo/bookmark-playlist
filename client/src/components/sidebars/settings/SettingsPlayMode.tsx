import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectPlayMode, setPlayMode } from "../../../redux/reducers/settingsSlice";
import { PlayMode } from "../../../types";

const SettingsPlayMode = () => {
  const playMode = useAppSelector(selectPlayMode);

  const dispatch = useAppDispatch();

  return (
    <div className='settings-playmode'>
      <div>
        <label htmlFor='playMode-select'>Play mode</label>
        <select
          id="playMode-select"
          value={playMode}
          onChange={({ target }) =>
            { dispatch(setPlayMode(target.value as PlayMode)); }
          }
        >
          <option value={PlayMode.MANUAL}>{PlayMode.MANUAL}</option>
          <option value={PlayMode.SEQUENCE}>{PlayMode.SEQUENCE}</option>
          <option value={PlayMode.SHUFFLE}>{PlayMode.SHUFFLE}</option>
        </select>
      </div>

      <p className='info'>
        Select how to choose the next album from the list when one ends.
        Queued albums are always prioritized
      </p>

      <ul>
        <li>
          <p><span>{PlayMode.MANUAL}</span> do not choose an album</p>
        </li>
        <li>
          <p><span>{PlayMode.SEQUENCE}</span> choose the next album</p>
        </li>
        <li>
          <p><span>{PlayMode.SHUFFLE}</span> choose random albums</p>
        </li>
      </ul>
    </div>
  );
};

export default SettingsPlayMode;

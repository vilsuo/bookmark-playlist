import { Fragment } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectAutoplay, selectAutoqueue, selectShowVideoDetails, toggleAutoplay, toggleAutoqueue, toggleShowVideoDetails } from "../../../redux/reducers/settingsSlice";
import SettingsCheckbox from "./SettingsCheckbox";

const SettingsToggleOptions = () => {
  // whether playing album is automatically started
  const autoplay = useAppSelector(selectAutoplay);

  // play to the next album in queue after the playing album ends
  const autoqueue = useAppSelector(selectAutoqueue);

  const showVideoDetails = useAppSelector(selectShowVideoDetails);

  const dispatch = useAppDispatch();

  return (
    <Fragment>
      <SettingsCheckbox
        value={autoplay}
        toggle={() => dispatch(toggleAutoplay())}
        label='Autoplay'
        details='Selected video will autoplay'
      />
      <SettingsCheckbox
        value={autoqueue}
        toggle={() => dispatch(toggleAutoqueue())}
        label='Autoqueue'
        details='Select the next album when a video ends'
      />
      <SettingsCheckbox
        value={showVideoDetails}
        toggle={() => dispatch(toggleShowVideoDetails())}
        label='Show playing album details'
      />
    </Fragment>
  );
};

export default SettingsToggleOptions;


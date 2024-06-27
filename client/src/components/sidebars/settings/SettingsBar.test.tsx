import { describe, expect, test } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../../../../test/testUtils';

import SettingsBar from "./SettingsBar";
import { initialState as initialSettingsState } from '../../../redux/reducers/settingsSlice';
import { PlayMode } from '../../../types';
import { changeOptionByLabel, findInputByLabelMatcher } from '../../../../test/uiHelpers';

describe("<SettingsBar />", () => {
  const mockClose = () => {};

  const autoPlayMatcher = /Autoplay/i;
  const playmodeMatcher = /Play mode/i;

  test("Should render settings bar", () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    screen.getByRole("heading", { name: "Settings" });
  });

  test("Correct default options should be selected", async () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    expect((await findInputByLabelMatcher(autoPlayMatcher)).checked)
      .toBe(initialSettingsState.autoplay);

    expect((await findInputByLabelMatcher(/Autoqueue/i)).checked)
      .toBe(initialSettingsState.autoqueue);

    expect((await findInputByLabelMatcher(/Show playing album details/i)).checked)
      .toBe(initialSettingsState.showVideoDetails);

    expect(await findInputByLabelMatcher(playmodeMatcher)).toHaveValue(
      initialSettingsState.playMode
    );
  });

  test("Can toggle settings", async () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    fireEvent.click((await findInputByLabelMatcher(autoPlayMatcher)));
    expect((await findInputByLabelMatcher(autoPlayMatcher)).checked)
      .toBe(!initialSettingsState.autoplay);

    fireEvent.click((await findInputByLabelMatcher(autoPlayMatcher)));
    expect((await findInputByLabelMatcher(autoPlayMatcher)).checked)
      .toBe(initialSettingsState.autoplay);
  });

  test("Can change playmode", async () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    const newPlaymode = PlayMode.SEQUENCE;

    // check that truly selecting a new playmode
    expect(newPlaymode).not.toBe(initialSettingsState.playMode);

    // select a new option
    changeOptionByLabel(playmodeMatcher, newPlaymode);

    expect(await findInputByLabelMatcher(playmodeMatcher))
      .toHaveValue(newPlaymode);
  });

});

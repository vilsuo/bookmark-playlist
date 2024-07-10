import { describe, expect, test } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../../../../test/testUtils';

import SettingsBar from "./SettingsBar";
import { initialState as initialSettingsState, selectAutoplay, selectPlayMode } from '../../../redux/reducers/settingsSlice';
import { PlayMode } from '../../../types';
import { changeOptionByLabel, findInputByLabelMatcher } from '../../../../test/uiHelpers';

describe("<SettingsBar />", () => {
  const mockClose = () => {};

  const autoPlayMatcher = /Autoplay/i;
  const playmodeMatcher = /Play mode/i;

  test("should render settings bar", () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    screen.getByRole("heading", { name: "Settings" });
  });

  test("should select default options", async () => {
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

  test("should be able to toggle settings", async () => {
    const { store } = renderWithProviders(<SettingsBar close={mockClose} />);

    // toggle for the first time
    fireEvent.click((await findInputByLabelMatcher(autoPlayMatcher)));
    expect((await findInputByLabelMatcher(autoPlayMatcher)).checked)
      .toBe(!initialSettingsState.autoplay);

    expect(selectAutoplay(store.getState())).toBe(!initialSettingsState.autoplay);

    // toggle for the second time
    fireEvent.click((await findInputByLabelMatcher(autoPlayMatcher)));
    expect((await findInputByLabelMatcher(autoPlayMatcher)).checked)
      .toBe(initialSettingsState.autoplay);

     expect(selectAutoplay(store.getState())).toBe(initialSettingsState.autoplay)
  });

  test("should be able to change play mode", async () => {
    const { store } = renderWithProviders(<SettingsBar close={mockClose} />);

    const newPlaymode = PlayMode.SEQUENCE;

    // check that truly selecting a new playmode
    expect(selectPlayMode(store.getState())).not.toBe(newPlaymode);

    // select a new option
    changeOptionByLabel(playmodeMatcher, newPlaymode);

    expect(await findInputByLabelMatcher(playmodeMatcher))
      .toHaveValue(newPlaymode);

    expect(selectPlayMode(store.getState())).toBe(newPlaymode);
  });
});

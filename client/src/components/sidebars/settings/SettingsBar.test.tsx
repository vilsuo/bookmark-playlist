import { describe, expect, test } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../../../redux/testUtils';

import SettingsBar from "./SettingsBar";
import { initialState as initialSettingsState } from '../../../redux/reducers/settingsSlice';

const findInputByMatcher = async (matcher: RegExp) => screen.findByLabelText<HTMLInputElement>(matcher);

describe("<SettingsBar />", () => {
  const mockClose = () => {};

  const autoPlayMatcher = /Autoplay/i;

  test("Should render settings bar", () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    screen.getByRole("heading", { name: "Settings" });
  });

  test("Correct default options should be selected", async () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    expect((await findInputByMatcher(autoPlayMatcher)).checked)
      .toBe(initialSettingsState.autoplay);

    expect((await findInputByMatcher(/Autoqueue/i)).checked)
      .toBe(initialSettingsState.autoqueue);

    expect((await findInputByMatcher(/Show playing album details/i)).checked)
      .toBe(initialSettingsState.showVideoDetails);

    expect(screen.getByLabelText(/Play mode/i)).toHaveValue(
      initialSettingsState.playMode
    );
  });

  test("Can toggle settings", async () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    fireEvent.click((await findInputByMatcher(autoPlayMatcher)));
    expect((await findInputByMatcher(autoPlayMatcher)).checked)
      .toBe(!initialSettingsState.autoplay);

    fireEvent.click((await findInputByMatcher(autoPlayMatcher)));
    expect((await findInputByMatcher(autoPlayMatcher)).checked)
      .toBe(initialSettingsState.autoplay);
  });

});

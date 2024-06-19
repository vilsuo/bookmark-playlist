import { describe, expect, test } from '@jest/globals';
import { screen } from '@testing-library/react';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../../../redux/testUtils';

import SettingsBar from "./SettingsBar";
//import { initialState as initialSettingsState } from '../../../redux/reducers/settingsSlice';

describe("<SettingsBar />", () => {
  const mockClose = () => {};

  //const preloadedState = {
  //  settings: {
  //    ...initialSettingsState,
  //  },
  //};

  test("Should render settings bar", () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    screen.getByRole("heading", { name: "Settings" });
  });

  test("Correct default options should be selected", async () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    expect(screen.getByLabelText(/Autoplay/i)).toBeChecked();
    expect(screen.getByLabelText(/Autoqueue/i)).toBeChecked();
    expect(screen.getByLabelText(/Show playing album details/i)).toBeChecked();
  });

});

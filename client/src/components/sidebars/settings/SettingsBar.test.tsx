import { describe, test } from '@jest/globals';
import { screen } from '@testing-library/react';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../../../testUtils/customRender';

import SettingsBar from "./SettingsBar";

describe("<SettingsBar />", () => {
  const mockClose = () => {};

  test("Should render settings bar", async () => {
    renderWithProviders(<SettingsBar close={mockClose} />);

    screen.getByRole("heading", { name: "Settings" });
  });

});

import { Matcher, fireEvent, screen, within } from '@testing-library/react';

export const notificationExistsByTitle = async (title: string) => {
  const notificationContainer = screen.getByTestId("notifications");
  await within(notificationContainer).findByText(title);
};

export const findInputByLabelMatcher = async (matcher: Matcher) =>
  screen.findByLabelText<HTMLInputElement>(matcher);

export const changeOptionByLabel = async (matcher: Matcher, value: string) => {
  fireEvent.change(await findInputByLabelMatcher(matcher), {
    target: { value },
  });
};

export const clickButton = (matcher: string | RegExp) => {
  fireEvent.click(screen.getByRole("button", { name: matcher }));
};

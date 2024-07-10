import { describe, expect, test } from "@jest/globals";
import NotificationContainer from "./NotificationContainer";
import { renderWithProviders } from "../../../../test/render";
import { createDefaultNotificationsRootState } from "../../../../test/state";
import { NotificationType } from "../../../types";
import { notificationExistsByTitle } from "../../../../test/uiHelpers";
import { fireEvent, screen, within } from "@testing-library/dom";
import { Notification, selectNotifications } from "../../../redux/reducers/notificationSlice";

const createTestState = (notifications: Notification[] = []) =>
  createDefaultNotificationsRootState({ notifications });

const closeNotificationByTitle = async (title: string) => {
  const notificationContainer = screen.getByTestId("notifications");
  const notification = (await within(notificationContainer).findByText(title))
    .closest(".notification") as HTMLElement;

  fireEvent.click(await within(notification).findByRole("button"));
};

describe("<NotificationContainer />", () => {
  const notifications = [
    {
      id: "1234",
      type: NotificationType.SUCCESS,
      title: "Success!",
      message: "This is a success message",
    },
    {
      id: "abcd",
      type: NotificationType.ERROR,
      title: "Error",
      message: "This is an error message",
    }
  ];

  test("should render a notification", async () => {
    const notification = notifications[0];
    const preloadedState = createTestState([notification]);

    renderWithProviders(<NotificationContainer />, { preloadedState });

    await notificationExistsByTitle(notification.title);
  });

  test("should remove a notification by closing it", async () => {
    const [removedNotification, otherNotification] = notifications;

    const preloadedState = createTestState(notifications);

    const { store } = renderWithProviders(<NotificationContainer />, { preloadedState });

    // notification should be found before removing it
    expect(screen.queryByText(removedNotification.title))
      .toBeInTheDocument();

    await closeNotificationByTitle(removedNotification.title);

    expect(selectNotifications(store.getState())).not.toContain(removedNotification);

    // notification should not be found after removing it
    expect(screen.queryByText(removedNotification.title))
      .not.toBeInTheDocument();

    // other notification should still be found
    await notificationExistsByTitle(otherNotification.title);

    expect(selectNotifications(store.getState())).toContain(otherNotification);
  });
});

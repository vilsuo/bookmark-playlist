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
    },
  ];

  test("should render a notification", async () => {
    const notification = notifications[0];
    const preloadedState = createTestState([notification]);

    renderWithProviders(<NotificationContainer />, { preloadedState });

    await notificationExistsByTitle(notification.title);
  });

  describe("closing a notification", () => {
    const [ notificationToBeClosed, notification ] = notifications;

    test("should not render the notification", async () => {
      const preloadedState = createTestState(notifications);
      renderWithProviders(<NotificationContainer />, { preloadedState });

      await closeNotificationByTitle(notificationToBeClosed.title);

      // notification should not be found after removing it
      expect(screen.queryByText(notificationToBeClosed.title))
        .not.toBeInTheDocument();
    });

    test("should render the other notifications", async () => {
      const preloadedState = createTestState(notifications);
      renderWithProviders(<NotificationContainer />, { preloadedState });

      await closeNotificationByTitle(notificationToBeClosed.title);
      
      expect(screen.queryByText(notification.title)).toBeInTheDocument();
    });

    test("should remove the notification", async () => {
      const preloadedState = createTestState(notifications);
      const { store } = renderWithProviders(
        <NotificationContainer />,
        { preloadedState },
      );

      await closeNotificationByTitle(notificationToBeClosed.title);

      expect(selectNotifications(store.getState()))
        .not.toContainEqual(notificationToBeClosed);
    });

    test("should not remove the other notifications", async () => {
      const preloadedState = createTestState(notifications);
      const { store } = renderWithProviders(
        <NotificationContainer />,
        { preloadedState },
      );

      await closeNotificationByTitle(notificationToBeClosed.title);

      const result = selectNotifications(store.getState());
      expect(result).toHaveLength(notifications.length - 1);
      expect(result).toContainEqual(notification);
    });
  });
});

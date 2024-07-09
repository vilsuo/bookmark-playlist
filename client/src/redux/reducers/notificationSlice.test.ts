import { describe, expect, jest, test } from "@jest/globals";

import { RootState, setupStore } from "../store";
import { createNotification, selectNotifications } from "./notificationSlice";
import { NotificationType } from "../../types";
import { createNotificationRootState } from "../../../test/creators";

jest.mock("uuid", () => ({ v4: () => "randomid" }));

describe("Notification slice", () => {
  describe("thunks", () => {
    describe("createNotification", () => {
      const notificationBase = {
        type: NotificationType.SUCCESS,
        title: "Test notification",
        message: "Test message",
      };
      
      const notification = {
        id: "randomid",
        ...notificationBase,
      };
      
      test("should add a notification", () => {
        const state: RootState = createNotificationRootState();
        const store = setupStore(state);
        
        store.dispatch(createNotification(notificationBase));

        const notifications = selectNotifications(store.getState());
        expect(notifications).toHaveLength(1);
        expect(notifications[0]).toStrictEqual(notification);
      });
    });
  });
});

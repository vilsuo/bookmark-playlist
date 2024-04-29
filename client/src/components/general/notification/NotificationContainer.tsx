import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeNotification, selectNotifications } from "../../../redux/reducers/notificationSlice";
import { Notification } from "./Notification";

const genKey = () => {
  return 1000000 * Math.random();
};

const NotificationContainer = () => {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();

  return (
    <div className="notification-container">
      { notifications.map((notification) => 
        <Notification
          key={genKey()}
          title={notification.title}
          type={notification.type}
          message={notification.message}
          close={() => dispatch(removeNotification(notification.id))}
        />
      )}
    </div>
  )
};

export default NotificationContainer;

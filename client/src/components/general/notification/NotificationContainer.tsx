import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { removeNotification, selectNotifications } from '../../../redux/reducers/notificationSlice';
import { Notification } from './Notification';

const NotificationContainer = () => {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();

  return (
    <div className="notification-container" data-testid="notifications">
      { notifications.map((notification) => 
        <Notification
          key={notification.id}
          title={notification.title}
          type={notification.type}
          message={notification.message}
          close={() => dispatch(removeNotification(notification.id))}
        />
      )}
    </div>
  );
};

export default NotificationContainer;

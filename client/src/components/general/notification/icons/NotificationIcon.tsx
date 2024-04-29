import { NotificationType } from '../../../../types';
import ErrorIcon from './ErrorIcon';
import SuccessIcon from './SuccessIcon';

interface NotificationIconProps {
  type: NotificationType;
  size?: number;
}

const NotificationIcon = ({ type, size }: NotificationIconProps) => {
  const params = { size };

  switch (type) {
    case NotificationType.SUCCESS:
      return <SuccessIcon { ...params } />;

    case NotificationType.ERROR:
      return <ErrorIcon { ...params } />;

    default:
      return type satisfies never;
  }
};

export default NotificationIcon;

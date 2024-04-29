import { NotificationType } from '../../../types';
import NotificationIcon from './icons/NotificationIcon';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string | undefined;
  close: () => void;
}

export const Notification = ({
  type,
  title,
  message,
  close,
}: NotificationProps) => {
  return (
    <div className="notification">
      <div className="header">
        <div className="title">
          <div className="icon-container">
            <NotificationIcon type={type} size={0.5} />
          </div>
          <p>{title}</p>
        </div>

        <button type="button" onClick={close}>&#x2715;</button>
      </div>

      { message && <p className="message">{message}</p> }
    </div>
  );
};

import { NotificationType } from '../../../types';
import SuccessIcon from './SuccessIcon';

interface NotificationProps {
  type: NotificationType;
  successTitle: string;
  errorTitle: string;
  message: string | null;
  close: () => void;
}

export const Notification = ({
  type,
  successTitle,
  errorTitle,
  message,
  close,
}: NotificationProps) => {
  const isSuccess = type === NotificationType.SUCCESS;
  const title = isSuccess ? successTitle : errorTitle;

  return (
    <div className={`notification ${type}`}>
      <div className="header">
        <div className="title">
          { isSuccess && <SuccessIcon size={0.5} /> }
          <p>{title}</p>
        </div>

        <button type="button" onClick={close}>&#x2715;</button>
      </div>

      { message && <p className="message">{message}</p> }
    </div>
  );
};

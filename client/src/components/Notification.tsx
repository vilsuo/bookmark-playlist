import { NotificationType } from '../types';

interface NotificationProps {
  type: NotificationType;
  successTitle: string;
  errorTitle: string;
  message: string | null;
  close: () => void;
}

export const Notification = ({
  type, successTitle, errorTitle, message, close,
}: NotificationProps) => {

  const isSuccess = type === NotificationType.SUCCESS;
  const title = isSuccess ? successTitle : errorTitle;

  // close the success notification after a timeout
  //setTimeout(() => {
  //  if (isSuccess) close();
  //}, 5000);

  return (
    <div className={`notification ${type}`}>
      <p>{title}</p>
      { message && <p className='message'>{message}</p> }
      <div className='action'>
        <button type='button' onClick={close}>Ok</button>
      </div>
    </div>
  );
};
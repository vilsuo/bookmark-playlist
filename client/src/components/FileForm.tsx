import { useRef, useState } from 'react';
import { Notification } from './Notification';
import { NotificationType } from '../types';
import { getErrorMessage } from '../util/axiosErrors';

interface FileFormProps {
  upload: (formdata: FormData) => Promise<void>;
}

const FileForm = ({ upload }: FileFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [name, setName] = useState('Thrash');

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<NotificationType | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setName('');
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('name', name);

    try {
      await upload(formData);
      handleReset();

      setMessage(null)
      setMessageType(NotificationType.SUCCESS);

    } catch (error) {
      setMessage(getErrorMessage(error));
      setMessageType(NotificationType.ERROR);
    }
  };

  return (
    <div className='file-form'>
      <h3>Upload bookmarks</h3>

      { messageType && (
        <Notification
          type={messageType}
          successTitle='Bookmark uploaded'
          errorTitle='Bookmark upload failed'
          message={message}
          close={() => {
            setMessage(null);
            setMessageType(null);
          }}
        />
      )}

      <div className='inputs'>
        <div className='folder-name'>
          <label htmlFor='folder-name-input'>Folder name:</label>
          <input
            type='text'
            value={name}
            onChange={({ target }) => setName(target.value)}
            id='folder-name-input'
          />
        </div>

        <input 
          type='file'
          ref={inputRef}
          onChange={handleFileChange}
          accept='.html'
          required
        />
      </div>

      <div className='actions'>
        <button onClick={handleReset}>Clear</button>
        <button disabled={!(name && file)} onClick={handleFileUpload}>Send</button>
      </div>
    </div>
  );
};

export default FileForm;

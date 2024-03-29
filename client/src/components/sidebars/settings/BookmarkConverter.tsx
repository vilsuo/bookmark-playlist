import { useRef, useState } from 'react';
import { Notification } from '../../general/Notification';
import { NotificationType } from '../../../types';
import { getErrorMessage } from '../../../util/axiosErrors';

interface FileFormProps {
  upload: (formdata: FormData) => Promise<void>;
}

const BookmarkConverter = ({ upload }: FileFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [name, setName] = useState('');

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

  const handleFileUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('name', name);

    try {
      await upload(formData);
      handleReset();

      setMessage(null);
      setMessageType(NotificationType.SUCCESS);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setMessageType(NotificationType.ERROR);
    }
  };

  return (
    <div className="bookmark-converter">
      <h3>Bookmarks converter</h3>

      <p className="info">
        Converts bookmarks HTML-file to JSON. Select the root folder where
        to look for links. Each link in a folder must be a youtube video.
        A folder can have child folders. Each link is converted into an album
        given by the link name:
        
        <span className="format">artist - album title (year)</span>

        The category of an album will be its parents folder name.
      </p>

      {messageType && (
        <Notification
          type={messageType}
          successTitle="Bookmarks imported"
          errorTitle="Bookmark import failed"
          message={message}
          close={() => {
            setMessage(null);
            setMessageType(null);
          }}
        />
      )}

      <form method='POST' onSubmit={handleFileUpload}>
        <label>
          Root folder:
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </label>

        <div>
          <label>
            Attachment:
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              accept=".html"
              required
            />
          </label>
          <span>Accepted filetypes: .html</span>
        </div>

        <button disabled={!(name && file)}>
          Send
        </button>
      </form>
    </div>
  );
};

export default BookmarkConverter;

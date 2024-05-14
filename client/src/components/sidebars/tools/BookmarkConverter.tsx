import { useRef, useState } from 'react';
import { NotificationType } from '../../../types';
import { useAppDispatch } from '../../../redux/hooks';
import { addNotification } from '../../../redux/reducers/notificationSlice';
import { createFromBookmarks } from '../../../redux/reducers/albumsSlice';
import { getThunkError } from '../../../util/errorMessages';

const BookmarkConverter = () => {
  const dispatch = useAppDispatch();

  const [file, setFile] = useState<File | null>();
  const [name, setName] = useState('');

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

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('name', name);

    try {
      await dispatch(createFromBookmarks(formData)).unwrap();

      dispatch(addNotification({
        type: NotificationType.SUCCESS,
        title: 'Bookmarks imported',
      }));
      
      handleReset();

    } catch (error) {
      dispatch(addNotification({
        type: NotificationType.ERROR,
        title: 'Bookmark import failed',
        message: getThunkError(error),
      }));
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
      
      <form method='POST' onSubmit={handleUpload}>
        <label>
          Root folder:
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            required
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

        <button disabled={ !(name && file) }>Convert</button>
      </form>
    </div>
  );
};

export default BookmarkConverter;

import { useRef, useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { createFromBookmarks } from '../../../redux/reducers/albums/albumsSlice';

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
    if (file) { formData.append('file', file, file.name); }
    formData.append('name', name);

    const resultAction = await dispatch(createFromBookmarks(formData));
    if (createFromBookmarks.fulfilled.match(resultAction)) {
      handleReset();
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

        <div className="actions">
          <button type="submit" disabled={ !(name && file) }>
            Convert
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookmarkConverter;

import { useRef, useState } from 'react';

interface FileFormProps {
  upload: (formdata: FormData) => Promise<void>;
}

const FileForm = ({ upload }: FileFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [name, setName] = useState('Thrash');

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

    } catch (error) {
      console.log('Error uploading', error);
    }
  };

  return (
    <div className='file-form'>
      <h3>Upload bookmarks</h3>

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
        <button onClick={handleFileUpload}>Send</button>
      </div>
    </div>
  );
};

export default FileForm;

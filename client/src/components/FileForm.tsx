import { useRef, useState } from 'react';

interface FileFormProps {
  upload: (formdata: FormData) => Promise<void>;
}

const FileForm = ({ upload }: FileFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [name, setName] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileReset = () => {
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
      //handleFileReset();

    } catch (error) {
      console.log('Error uploading', error);
    }
  };

  return (
    <div className='file-form'>
      <input 
        type='file'
        ref={inputRef}
        onChange={handleFileChange}
        accept='.html'
        required
      />

      <label>
        Name:
        <input
          type='text'
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </label>

      <div className='actions'>
        <button onClick={handleFileUpload}>
          Send
        </button>

        <button onClick={handleFileReset}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default FileForm;

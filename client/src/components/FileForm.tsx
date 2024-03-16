import { useRef, useState } from 'react';

interface FileFormProps {
  upload: (formdata: FormData) => Promise<void>;
}

const FileForm = ({ upload }: FileFormProps) => {
  const [file, setFile] = useState<File | null>();
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

    try {
      await upload(formData);
      //handleFileReset();

    } catch (error) {
      console.log('Error uploading', error);
    }
  };

  return (
    <div>
      <input 
        type='file'
        ref={inputRef}
        onChange={handleFileChange}
        accept='.html'
        required
      />

      <button onClick={handleFileUpload}>
        Send
      </button>

      <button onClick={handleFileReset}>
        Reset
      </button>
    </div>
  );
};

export default FileForm;

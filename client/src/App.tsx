import axios from 'axios';
import React, { useRef, useState } from 'react';
//import YouTube from 'react-youtube';

/*
const VideoClip = ({ videoId, options }) => {
  return (
    <YouTube
      videoId={videoId}
      options={options}
      onReady={({ target }) => target.pauseVideo()}
      id='video'
    />
  );
};

<div>
  <VideoClip
    videoId={'7w5VLRi6jCQ'}
    options={{
      width: '945',
      height: '540',
      playerVars: {
        autoplay: 1,
        controls: 1,
      },
    }}
  />
*/

const App = () => {
  // file
  const [file, setFile] = useState<File | null>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileReset = () => {
    setFile(null);
    // added if-clause
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

    //const htmlFile = new File([file], file.name, { type: 'text/html' });
    //console.log(htmlFile);
    
    const formData = new FormData();
    formData.append('file', file, file.name);
    try {
      const { data } = await axios.post(
        `api/bookmark`,
        formData,
      );

      console.log('Success', data);
      //handleFileReset();

    } catch (error) {
      console.log('Error uploading', error);
    }
  };

  console.log('file', file);

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

export default App;

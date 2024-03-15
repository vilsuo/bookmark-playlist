import axios from 'axios';
import { useState } from 'react';
import FileForm from './components/FileForm';
import { Link } from './types';
import LinkList from './components/LinkList';
import Video from './components/Video';

const App = () => {
  const [links, setLinks] = useState<Array<Link>>([]);
  const [currentLink, setCurrentLink] = useState<Link | null>();

  const handleUpload = async (formData: FormData) => {
    const { data } = await axios.post(
      `api/bookmark`,
      formData,
    );

    setLinks(data);
  };

  return (
    <div>
      <FileForm upload={handleUpload} />

      <p>Selected {currentLink ? currentLink.title : 'none'}</p>
      { currentLink && (
        <Video link={currentLink} />
      )}

      <LinkList
        links={links}
        setCurrentLink={setCurrentLink}
      />
    </div>
  );
};

export default App;

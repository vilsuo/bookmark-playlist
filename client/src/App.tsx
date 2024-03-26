import { useState } from 'react';
import { Album, SidebarType,  } from './types';
import * as bookmarksService from './util/bookmarksService';
import SidebarOpener from './components/sidebars/opener/SidebarOpener';
import Sidebar from './components/sidebars/Sidebar';
import Main from './components/Main';

const App = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  // the current opened sidebar
  const [sidebarType, setSidebarType] = useState<SidebarType | null>(null);

  const closeSidebar = () => setSidebarType(null);

  const handleUpload = async (formData: FormData) => {
    const responseData = await bookmarksService.createAlbums(formData);
    setAlbums(responseData);
  };

  return (
    <div className="container">
      { (sidebarType !== null) ? (
        <Sidebar 
          type={sidebarType}
          close={closeSidebar}
          upload={handleUpload}
          albums={albums}
        />
      ) : (
        <SidebarOpener 
          show={setSidebarType}
        />
      )}

      <Main />
    </div>
  );
};

export default App;

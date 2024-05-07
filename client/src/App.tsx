import { useEffect, useState } from 'react';
import { SidebarType,  } from './types';
import SidebarOpener from './components/sidebars/opener/SidebarOpener';
import Sidebar from './components/sidebars/Sidebar';
import Main from './components/Main';
import NotificationContainer from './components/general/notification/NotificationContainer';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchAlbums, selectAlbums } from './redux/reducers/albumsSlice';

const App = () => {
  const albums = useAppSelector(selectAlbums);

  // the current opened sidebar
  const [sidebarType, setSidebarType] = useState<SidebarType | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async () => {
      await dispatch(fetchAlbums());
    };

    load();
  }, [dispatch]);

  const closeSidebar = () => setSidebarType(null);

  return (
    <div className="container">
      { (sidebarType !== null) ? (
        <Sidebar 
          type={sidebarType}
          close={closeSidebar}
          albums={albums}
        />
      ) : (
        <SidebarOpener 
          show={setSidebarType}
        />
      )}

      <NotificationContainer />

      <Main />
    </div>
  );
};

export default App;

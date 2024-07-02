import { useEffect } from 'react';
import Main from './components/Main';
import NotificationContainer from './components/general/notification/NotificationContainer';
import { useAppDispatch } from './redux/hooks';
import { fetchAlbums } from './redux/reducers/albums/albumsSlice';
import SidebarContainer from './components/sidebars/SidebarContainer';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  return (
    <div className="container">
      <SidebarContainer />

      <NotificationContainer />

      <Main />
    </div>
  );
};

export default App;

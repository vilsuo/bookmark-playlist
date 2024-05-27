import { useEffect } from 'react';
import Main from './components/Main';
import NotificationContainer from './components/general/notification/NotificationContainer';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchAlbums, selectAlbums } from './redux/reducers/albumsSlice';
import SidebarContainer from './components/sidebars/SidebarContainer';

const App = () => {
  const albums = useAppSelector(selectAlbums);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async () => {
      await dispatch(fetchAlbums());
    };

    load();
  }, [dispatch]);

  return (
    <div className="container">
      <SidebarContainer albums={albums} />

      <NotificationContainer />

      <Main />
    </div>
  );
};

export default App;

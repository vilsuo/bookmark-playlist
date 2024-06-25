import { useEffect } from 'react';
import Main from './components/Main';
import NotificationContainer from './components/general/notification/NotificationContainer';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchAlbums, selectSortedAndFilteredAlbums } from './redux/reducers/albumsSlice';
import SidebarContainer from './components/sidebars/SidebarContainer';

const App = () => {
  const filteredAndSortedAlbums = useAppSelector(selectSortedAndFilteredAlbums);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  return (
    <div className="container">
      <SidebarContainer albums={filteredAndSortedAlbums} />

      <NotificationContainer />

      <Main albums={filteredAndSortedAlbums} />
    </div>
  );
};

export default App;

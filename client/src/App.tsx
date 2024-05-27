import { useEffect, useState } from 'react';
import Main from './components/Main';
import NotificationContainer from './components/general/notification/NotificationContainer';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchAlbums, selectAlbums } from './redux/reducers/albumsSlice';
import SidebarContainer from './components/sidebars/SidebarContainer';
import { Album } from './types';
import { getFilterFn, getSortFn, selectFilters } from './redux/reducers/filterSlice';

const App = () => {
  const albums = useAppSelector(selectAlbums);

  const dispatch = useAppDispatch();

  const [filteredAndSortedAlbums, setSortedAlbums] = useState<Album[]>([]);
  const filterState = useAppSelector(selectFilters);

  useEffect(() => {
    const load = async () => {
      await dispatch(fetchAlbums());
    };

    load();
  }, [dispatch]);

  useEffect(() => {
    setSortedAlbums(
      albums
        .filter(getFilterFn(filterState))
        .toSorted(getSortFn(filterState.sortColumn, filterState.sortOrder))
    );
  }, [albums, filterState]);

  return (
    <div className="container">
      <SidebarContainer albums={filteredAndSortedAlbums} />

      <NotificationContainer />

      <Main albums={filteredAndSortedAlbums} />
    </div>
  );
};

export default App;

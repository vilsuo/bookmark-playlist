import { useEffect, useState } from 'react';
import Main from './components/Main';
import NotificationContainer from './components/general/notification/NotificationContainer';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchAlbums, getCategories, selectAlbums } from './redux/reducers/albumsSlice';
import SidebarContainer from './components/sidebars/SidebarContainer';
import { Album } from './types';
import { getFilterFn, getSortFn, selectFilters, setFilterCategories } from './redux/reducers/filterSlice';

const App = () => {
  const albums = useAppSelector(selectAlbums);

  const dispatch = useAppDispatch();

  const [filteredAndSortedAlbums, setSortedAlbums] = useState<Album[]>([]);
  const filterState = useAppSelector(selectFilters);

  useEffect(() => {
    // load albums
    dispatch(fetchAlbums())
      .unwrap()
      .then(loadedAlbums => {
        // include all categories in filter
        const categories = getCategories(loadedAlbums);
        dispatch(setFilterCategories(categories));
      });
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

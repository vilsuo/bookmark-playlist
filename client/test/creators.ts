import { AlbumsState, initialState as initialAlbumsState } from "../src/redux/reducers/albums/albumsSlice";
import { Filter, FilterCategories, FilterState, Sort, initialState as initialFilterState } from "../src/redux/reducers/filters/filterSlice";
import { Notification, NotificationState } from "../src/redux/reducers/notificationSlice";
import { QueueState } from "../src/redux/reducers/queueSlice";
import { SettingsState, initialState as initialSettingsState } from "../src/redux/reducers/settingsSlice";
import { RootState } from "../src/redux/store";
import { Album } from "../src/types";

export const createAlbumWithCategory = (album: Album, category: string): Album => ({
  ...album, category,
});

// STATES

export const createAlbumsState = (values?: Partial<AlbumsState>): AlbumsState => (
  { ...initialAlbumsState, ...values } as AlbumsState
);

export const createFilterState = ({ sorting, filters }: {
  sorting?: Partial<Sort>,
  filters?: Partial<Filter>,
}= {}): FilterState => ({
  sorting: { ...initialFilterState.sorting, ...sorting },
  filters: { ...initialFilterState.filters, ...filters },
});

export const createSettingsState = (settings?: Partial<SettingsState>): SettingsState => (
  { ...initialSettingsState, ...settings }
);

export const createQueueState = (albums: Album[] = []): QueueState => (
  { queue: albums }
);

export const createNotificationState = (notifications: Notification[] = [])
: NotificationState => ({ notifications });

export const createCategoryFilterState = (categories: FilterCategories) =>
  createFilterState({ filters: { categories } });

// ROOT
export const createFilteringAndSortingRootState = (
  { albums = [], sorting, filters }: {
    albums?: Album[],
    sorting?: Sort,
    filters?: Partial<Filter>,
  } = {}
): RootState => (
  {
    albums: createAlbumsState({ albums }) ,
    filters: createFilterState({ sorting, filters }),
  } as RootState
);

export const createAlbumCategoryFilterRootState = (
  categories: FilterCategories,
  albums: Album[],
): RootState => (
  {
    filters: createCategoryFilterState(categories),
    albums: createAlbumsState({ albums }),
  } as RootState
);
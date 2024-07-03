import { AlbumsState, initialState as initialAlbumsState } from "../src/redux/reducers/albums/albumsSlice";
import { Filter, FilterState, Sort, initialState as initialFilterState } from "../src/redux/reducers/filters/filterSlice";
import { Notification, NotificationState } from "../src/redux/reducers/notificationSlice";
import { QueueState } from "../src/redux/reducers/queueSlice";
import { Album } from "../src/types";

export const createAlbumWithCategory = (album: Album, category: string): Album => ({
  ...album, category,
});

// STATES

export const createAlbumsState = (
  values: Partial<AlbumsState>
): AlbumsState => (
  { ...initialAlbumsState, ...values } as AlbumsState
);

export const createFilterState = (
  sorting: Partial<Sort>,
  filters: Partial<Filter>,
): FilterState => (
  {
    sorting: { ...initialFilterState.sorting, ...sorting },
    filters: { ...initialFilterState.filters, ...filters },
  } as FilterState
);

export const createQueueState = (albums: QueueState["queue"]): QueueState => (
  { queue: albums }
);

export const createNotificationState = (notifications: Notification[] = [])
: NotificationState => ({ notifications });

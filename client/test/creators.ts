import { AlbumsState, initialState as initialAlbumsState } from "../src/redux/reducers/albums/albumsSlice";
import { Filter, FilterState, Sort, initialState as initialFilterState } from "../src/redux/reducers/filters/filterSlice";
import { Notification, NotificationState } from "../src/redux/reducers/notificationSlice";
import { QueueState } from "../src/redux/reducers/queueSlice";

export const createAlbumsState = (
  values: Partial<AlbumsState> = initialAlbumsState
): AlbumsState => (
  { ...values } as AlbumsState
);

export const createFilterState = (
  sorting: Partial<Sort> = initialFilterState.sorting,
  filters: Partial<Filter> = initialFilterState.filters,
): FilterState => (
  { sorting, filters } as FilterState
);

export const createQueueState = (albums: QueueState["queue"]): QueueState => (
  { queue: albums }
);

export const createNotificationState = (notifications: Notification[] = [])
: NotificationState => ({ notifications });

import { AlbumsState, initialState as initialAlbumsState } from "../src/redux/reducers/albums/albumsSlice";
import { Filter, FilterState, Sort, initialState as initialFilterState } from "../src/redux/reducers/filters/filterSlice";
import { initialState as initialNotificationsState, NotificationState } from "../src/redux/reducers/notificationSlice";
import { QueueState, initialState as initialQueueState } from "../src/redux/reducers/queueSlice";
import { SettingsState, initialState as initialSettingsState } from "../src/redux/reducers/settingsSlice";
import { RootState } from "../src/redux/store";
import { Album } from "../src/types";

// SINGLES

// ALBUMS
export const createDefaultAlbumsState = (
  values?: Partial<AlbumsState>
): AlbumsState => (
  { ...initialAlbumsState, ...values } as AlbumsState
);

export const createDefaultAlbumsRootState = (
  values?: Partial<AlbumsState>
): RootState => (
  { albums: createDefaultAlbumsState(values) } as RootState
);

// FILTER
export const createDefaultFiltersState = ({ sorting, filters }: {
  sorting?: Partial<Sort>,
  filters?: Partial<Filter>,
} = {}): FilterState => ({
  sorting: { ...initialFilterState.sorting, ...sorting },
  filters: { ...initialFilterState.filters, ...filters },
});

export const createDefaultFiltersRootState = ({ sorting, filters }: {
  sorting?: Partial<Sort>,
  filters?: Partial<Filter>,
} = {}): RootState => (
  { filters: createDefaultFiltersState({ sorting, filters }) } as RootState
);

// QUEUE
export const createDefaultQueueState = (
  values?: Partial<QueueState>
): QueueState => (
  { ...initialQueueState, ...values }
);

export const createDefaultQueueRootState = (
  values?: Partial<QueueState>
): RootState => (
  { queue: createDefaultQueueState(values) } as RootState
);

// NOTIFICATION
export const createDefaultNotificationState = (
  values?: Partial<NotificationState>
): NotificationState => (
  { ...initialNotificationsState, ...values }
);

export const createDefaultNotificationsRootState = (
  values?: Partial<NotificationState>
): RootState => (
  { notifications: createDefaultNotificationState(values) } as RootState
);

// SETTINGS
export const createSettingsState = (
  settings?: Partial<SettingsState>
): SettingsState => (
  { ...initialSettingsState, ...settings }
);


// COMBINED

export const createAlbumsFiltersRootState = ({
  albums, sorting, filters,
}: {
  albums?: Album[],
  sorting?: Partial<Sort>,
  filters?: Partial<Filter>,
} = {}): RootState => (
  {
    albums: createDefaultAlbumsState({ albums }),
    filters: createDefaultFiltersState({ sorting, filters }),
  } as RootState
);

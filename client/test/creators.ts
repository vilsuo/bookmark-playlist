import { AlbumsState, initialState as initialAlbumsState } from "../src/redux/reducers/albumsSlice";
import { FilterState, initialState as initialFilterState } from "../src/redux/reducers/filterSlice";
import { QueueState } from "../src/redux/reducers/queueSlice";

export const createAlbumsState = (
  values: Partial<AlbumsState> = initialAlbumsState
): AlbumsState => (
  { ...values } as AlbumsState
);

export const createFilterState = (
  filters: Partial<FilterState> = initialFilterState
): FilterState => (
  { ...filters } as FilterState
);

export const createQueueState = (albums: QueueState["queue"]): QueueState => (
  { queue: albums }
);

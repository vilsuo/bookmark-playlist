import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Album, AlbumCreation } from '../../types';
import { RootState } from '../store';
import * as albumService from '../../util/albumService';
import * as converterService from '../../util/converterService';
import { getErrorMessage } from '../../util/errorMessages';

export interface AlbumsState {
  viewing: Album | null;
  playing: Album | null;
  albums: Album[];
};

const initialState: AlbumsState = {
  viewing: null,
  playing: null,
  albums: [],
};

const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    view: (state, action: PayloadAction<Album | null>) => {
      const album = action.payload;
      state.viewing = album;
    },
    play: (state, action: PayloadAction<Album | null>) => {
      const album = action.payload;
      state.playing = album;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        const albums = action.payload;
        state.albums = albums;
      })
      .addCase(createFromBookmarks.fulfilled, (state, action) => {
        const newAlbums = action.payload;
        state.albums = state.albums.concat(newAlbums);
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        const newAlbum = action.payload;
        state.albums.push(newAlbum);
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        const updatedAlbum = action.payload;
        state.albums = state.albums.map((album) => 
          (album.id === updatedAlbum.id) ? updatedAlbum : album
        );
      });
  },
});

export const fetchAlbums = createAsyncThunk(
  'albums/fetchAlbums',
  async () => {
    const response = await albumService.getAlbums();
    return response.data;
  },
);

type RejectedResponse = { /*title: string,*/ errorMessage: string };

export const isRejectedResponse = (error: unknown): error is RejectedResponse => {
  return (typeof error === 'object' && error !== null) &&
    ('errorMessage' in error && typeof error.errorMessage === 'string');
};

// CREATE FROM BOOKMARKS
export const createFromBookmarks = createAsyncThunk<
  Album[],
  FormData,
  { rejectValue: RejectedResponse }
>(
  'albums/createFromBookmarks',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await converterService.convertBookmarks(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue({ errorMessage: getErrorMessage(error) });
    }
  },
);

// CREATE ONE
export const createAlbum = createAsyncThunk(
  'albums/create',
  async (albumValues: AlbumCreation, { rejectWithValue }) => {
    try {
      const response = await albumService.create(albumValues);
      return response.data;
    } catch (error) {
      return rejectWithValue({ errorMessage: getErrorMessage(error) });
    }
  }
);

// UPDATE
export const updateAlbum = createAsyncThunk<
  Album,
  Album,
  { rejectValue: RejectedResponse }
>(
  'albums/update',
  async (album: Album, { rejectWithValue }) => {
    try {
      const response = await albumService.update(album);
      return response.data;
    } catch (error) {
      return rejectWithValue({ errorMessage: getErrorMessage(error) });
    }
  }
);

export const { view, play } = albumsSlice.actions;

export const selectViewing = (state: RootState) => state.albums.viewing;
export const selectPlaying = (state: RootState) => state.albums.playing;
export const selectAlbums = (state: RootState) => state.albums.albums;

export default albumsSlice.reducer;

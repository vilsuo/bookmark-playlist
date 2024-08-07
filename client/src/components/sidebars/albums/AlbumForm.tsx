import { useState } from 'react';
import { AlbumCreation } from '../../../types';
import { useAppSelector } from '../../../redux/hooks';
import { selectAlbumCategories } from '../../../redux/reducers/albums/albumsSlice';
import { CATEGORY_OTHER } from '../../../constants';

interface CategorySelectProps {
  category: string;
  setCategory: (category: string) => void;
}

const CategorySelect = ({ category, setCategory }: CategorySelectProps) => {
  const [inputSelected, setInputSelected] = useState(category === CATEGORY_OTHER);

  const categories = useAppSelector(selectAlbumCategories);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setInputSelected(value === CATEGORY_OTHER);
    setCategory(value);
  };

  return (
    <div className="category-select">
      <div>
        <label>Category
        <select
          value={category}
          onChange={handleSelect}
        >
          <option value={CATEGORY_OTHER}>-- Other --</option>

          {categories.map(c =>
            <option key={c} value={c}>
              {c}
            </option>
          )}
        </select>
        </label>
        { inputSelected && (
          <input autoFocus
            type='text'
            value={category}
            onChange={({ target }) => setCategory(target.value)}
            required
          />
        )}
      </div>
    </div>
  );
};

interface AlbumFormProps {
  album: AlbumCreation;
  submit: (album: AlbumCreation) => Promise<void>;
  children: React.ReactNode;
}

const AlbumForm = ({ album, submit, children }: AlbumFormProps) => {
  const [artist, setArtist] = useState(album.artist);
  const [title, setTitle] = useState(album.title);
  const [published, setPublished] = useState(album.published);
  const [category, setCategory] = useState(album.category);
  const [videoId, setVideoId] = useState(album.videoId);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await submit({ artist, title, published, category, videoId  });
  };

  return (
    <form className="album-form" onSubmit={handleSubmit}>
      <label>
        <span>Artist</span>
        <input
          type='text'
          value={artist}
          onChange={({ target }) => setArtist(target.value)}
          required
        />
      </label>
      <label>
        <span>Title</span>
        <input
          type='text'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          required
        />
      </label>
      <label>
        <span>Published</span>
        <input
          type='number'
          min={1000}
          max={9999}
          value={published}
          onChange={({ target }) => setPublished(Number(target.value))}
          required
        />
      </label>

      <CategorySelect category={category} setCategory={setCategory} />

      <label>
        <span>Video id</span>
        <input
          type='text'
          value={videoId}
          onChange={({ target }) => setVideoId(target.value)}
          required
        />
      </label>

      <div className="options">
        { children }
      </div>
    </form>
  );
};

export default AlbumForm;

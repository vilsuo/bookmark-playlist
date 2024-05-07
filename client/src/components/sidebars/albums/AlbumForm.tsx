import { useEffect, useState } from 'react';
import { AlbumCreation } from '../../../types';

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

  useEffect(() => {
    setArtist(album.artist);
    setTitle(album.title);
    setPublished(album.published);
    setCategory(album.category);
    setVideoId(album.videoId);
  }, [album]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await submit({ artist, title, published, category, videoId  });
  }

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
      <label>
        <span>Category</span>
        <input
          type='text'
          value={category}
          onChange={({ target }) => setCategory(target.value)}
          required
        />
      </label>
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

import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { queueAdd } from '../../../redux/reducers/queueSlice';
import { Album } from '../../../types';

interface AlbumEditProps {
  album: Album;
  close: () => void;
}

const AlbumEdit = ({ album, close }: AlbumEditProps) => {
  return (
    <div className="editor">
      <div className="header">
        <h2>Edit</h2>
        <button onClick={close}>&#x2715;</button>
      </div>
      <p>Editing {album.artist} - {album.title}</p>
    </div>
  );
};

interface AlbumsViewProps {
  album: Album;
  close: () => void;
  play: () => void;
}

const AlbumsView = ({ album, close, play }: AlbumsViewProps) => {
  const [editorOpen, setEditorOpen] = useState(false);

  const dispatch = useAppDispatch();
  const addToQueue = () => dispatch(queueAdd(album));

  const openEdit = () => {
    console.log('editing', album);
    setEditorOpen(!editorOpen);
  };

  return (
    <>
      { editorOpen && (
        <AlbumEdit
          album={album}
          close={() => setEditorOpen(false)}
        />
      )}

      <div className="albums-view">
        <div className="header">
          <h3>Selected Album</h3>
          <button onClick={close}>&#x2715;</button>
        </div>

        <div className="content">
          <div className="actions">
            <button className="play-button" onClick={play}>Play</button>
            <button onClick={addToQueue}>Q</button>
            <button onClick={openEdit}>Edit</button>
          </div>

          <div className="details">
            <span className="artist">{album.artist}</span>
            <span className="title">{album.title}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlbumsView;

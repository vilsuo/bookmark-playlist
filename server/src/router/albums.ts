import express from 'express';
import * as albumService from '../album/album.service';
import { AlbumBase } from '../types';

const router = express();

router.get('/', async (_req, res) => {
  const albums = await albumService.findAll();
  return res.send(albums);
});


const toAlbumBase = (body: unknown): AlbumBase => {
  if (!body || typeof body !== 'object') {
    throw new Error('Body is invalid or missing');
  }

  if (
    !('videoId' in body) || !('artist' in body) || !('title' in body) ||
    !('published' in body) || !('category' in body) || !('addDate' in body)
  ) {
    throw new Error('missing required values');
  }

  const { videoId, artist, title, published, category, addDate } = body;

  if (typeof videoId !== 'string') {
    throw new Error("Invalid property 'videoId'");
  }

  if (typeof artist !== 'string') {
    throw new Error("Invalid property 'artist'");
  }

  if (typeof title !== 'string') {
    throw new Error("Invalid property 'title'");
  }

  if (typeof published !== 'number') {
    throw new Error("Invalid property 'published'");
  }

  if (typeof category !== 'string') {
    throw new Error("Invalid property 'category'");
  }

  if (typeof addDate !== 'string') {
    throw new Error("Invalid property 'addDate'");
  }

  return { videoId, artist, title, published, category, addDate: new Date(addDate) };
};

router.post('/', async (req, res) => {
  let { body } = req;

  const newBase = toAlbumBase(body);
  const created = await albumService.createIfNotExists(newBase);
  return res.status(201).send(created);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send({ message: 'Invalid path variable' });
  }

  const updateBase = toAlbumBase(req.body);
  const result = await albumService.update(id, updateBase);
  return res.send(result);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send({ message: 'Invalid path variable' });
  }

  await albumService.remove(id);
  return res.status(204).end();
});

export default router;

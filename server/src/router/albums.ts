import express from 'express';
import * as albumService from '../album/album.service';
import { AlbumBase } from '../types';

const router = express();

// add query option for category?
router.get('/', async (_req, res) => {
  const albums = await albumService.findAll();
  return res.send(albums);
});

router.post('/', async (req, res) => {
  let { body } = req;

  body = body.map((base: AlbumBase) => ({ ...base, addDate: new Date(base.addDate) }));

  const album = await albumService.createIfNotExistsMany(body);
  return res.status(201).send(album);
});

/*
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send({ message: 'Invalid path variable' });
  }

  return albumService.update(id, req.body);
});
*/

export default router;

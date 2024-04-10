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

  const album = await albumService.createAndSaveMany(body);
  return res.status(201).send(album);
});

export default router;

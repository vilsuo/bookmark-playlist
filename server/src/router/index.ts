import express from 'express';

import bookmarkRouter from './bookmark';
import albumsRouter from './albums';

const router = express();

router.use(express.json());

router.use('/bookmark', bookmarkRouter);
router.use('/albums', albumsRouter);

export default router;

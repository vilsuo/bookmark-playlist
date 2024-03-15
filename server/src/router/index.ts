import express from 'express';

import bookmarkRouter from './bookmark';

const router = express();

router.use(express.json());

router.use('/bookmark', bookmarkRouter);

export default router;

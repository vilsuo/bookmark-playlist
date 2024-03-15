import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const options = {
  storage: multer.memoryStorage()
};

const FILE_TYPES = ['html'];
const regex = new RegExp(FILE_TYPES.join('|'));

interface FileFilter {
  (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void;
}

const fileFilter: FileFilter = (_req, file, cb) => {
  const mimetype = regex.test(file.mimetype);
  const extname = regex.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  return cb(new Error(
    `File upload only supports the filetypes [${FILE_TYPES.join('|')}]`,
  ));
};

const fileUpload = multer({
  ...options,
  fileFilter,
});

export const singleUpload = fileUpload.single('file');

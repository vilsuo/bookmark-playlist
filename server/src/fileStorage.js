const multer = require('multer');
const path = require('path');

const options = {
  //storage: multer.memoryStorage(),
  dest: 'uploads/',
};

const FILE_TYPES = ['html']
const regex = new RegExp(FILE_TYPES.join('|'));

const fileFilter = (req, file, cb) => {
  const mimetype = regex.test(file.mimetype);
  const extname = regex.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  return cb(new Error(
    `File upload only supports the filetypes [${FILE_TYPES.join('|')}]`,
  ));
};

const upload = multer({
  ...options,
  fileFilter,
});

module.exports = {
  upload,
};
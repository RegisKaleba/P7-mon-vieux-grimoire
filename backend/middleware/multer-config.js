const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(' ').join('_');
    const extension = file.originalname.split('.').pop();
    const uniqueName = `${name}_${Date.now()}.${extension}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
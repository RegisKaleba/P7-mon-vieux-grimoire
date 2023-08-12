const multer = require('multer');
const sharp = require('sharp'); 

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

// Middleware pour redimensionner l'image
const imgResize = async (req, res, next) => {
  if (req.file) {
    const newName = req.file.filename.split('.')[0] + '_resized.jpg'; 
    await sharp(req.file.path)
      .resize(206, 260) 
      .toFile(`images/${newName}`);

    req.file.filename = newName; 
    req.file.path = `images/${newName}`; 
  }

  next();
};

module.exports = { upload, imgResize };
const multer = require('multer');
const sharp = require('sharp'); // Importez le module Sharp

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
    const newName = req.file.filename.split('.')[0] + '_resized.jpg'; // Nouveau nom pour l'image redimensionnée

    await sharp(req.file.path)
      .resize(206, 260) // Remplacez NEW_WIDTH et NEW_HEIGHT par les dimensions souhaitées
      .toFile(`images/${newName}`);

    req.file.filename = newName; // Met à jour le nom de fichier avec le nom redimensionné
    req.file.path = `images/${newName}`; // Met également à jour le chemin du fichier
  }

  next();
};

module.exports = { upload, imgResize };
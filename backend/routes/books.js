const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, imgResize } = require('../middleware/multer-config'); // Importez upload et imgResize directement

const booksCtrl = require('../controllers/books');

router.get('/bestrating', booksCtrl.getBestRatingBooks);
router.put('/:id', auth, upload.single('image'), imgResize, booksCtrl.modifyBook);
router.post('/', auth, upload.single('image'), imgResize, booksCtrl.createBook);
router.get('/:id', booksCtrl.getOneBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.postRatingBook);
router.get('/', booksCtrl.getAllBooks);

module.exports = router;
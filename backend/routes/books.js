const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCtrl = require('../controllers/books');


router.get('/bestrating', booksCtrl.getBestRatingBooks);
router.post('/', auth, multer.single('image'), booksCtrl.createBook);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer.single('image'), booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.postRatingBook);
router.get('/', booksCtrl.getAllBooks);

module.exports = router;
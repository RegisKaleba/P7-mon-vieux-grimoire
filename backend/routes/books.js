const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer.single('image'), booksCtrl.createBook); // Utiliser multer.single('image') ici
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer.single('image'), booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);


module.exports = router;
const Book = require('../models/book');

const multerConfig = require('../middleware/multer-config');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Utiliser req.file.filename pour obtenir le nom du fichier
  });

  book.save()
    .then(() => { res.status(201).json({ message: 'Book saved' }) })
    .catch(error => { res.status(400).json({ error }) });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  };


exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book => {
            if(book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not Authorized' });
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Book modified'}))
                    .catch(error => res.status(401).json({ error }));
            }
        }))
        .catch((error) => res.status(400).json({ error }));
};


exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  };


exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
  };

exports.getBestRatingBooks = (req, res, next) => {
    Book.find()
      .sort({ averageRating: -1 })
      .then(books => {
        
        const topRatedBooks = books.slice(0, 3);
        res.status(200).json(topRatedBooks);
      })
      .catch(error => res.status(400).json({ error }));
  };

  exports.postRatingBook = (req, res, next) => {
    const { userId, rating } = req.body;

    Book.findOne({ _id: req.params.id })
        .then(book => {
            const userHaveNotRated = book.ratings.every(rating => rating.userId !== userId);
            if (!userHaveNotRated) {
                res.status(401).json({ message: 'Book already rated by user' });
                return;
            }

            // Ajouter la nouvelle notation à la liste des notations
            book.ratings.push({ userId, grade: rating });

            // Calculer la nouvelle moyenne des notes
            const totalRatings = book.ratings.length;
            const totalGradeSum = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            const newAverageRating = totalGradeSum / totalRatings;

            // Arrondir la moyenne des notes à l'entier supérieur
            book.averageRating = Math.round(newAverageRating);

            // Enregistrer les modifications dans la base de données
            return book.save();
        })
        .then(updatedBook => {
            res.status(201).json(updatedBook);
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String },
  imageUrl: { type: String, required: true },
  year: { type: Number },
  genre: { type: String },
});

module.exports = mongoose.model('Book', bookSchema);
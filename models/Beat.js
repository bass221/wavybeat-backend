// models/Beat.js
const mongoose = require('mongoose');

const BeatSchema = new mongoose.Schema({
  title: String,
  genre: String,
  price: Number,
  filePath: String,
  imagePath: String,
  zipPath: String,
});

module.exports = mongoose.model('Beat', BeatSchema);

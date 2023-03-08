const mongoose = require('mongoose')
const Schema = mongoose.Schema

const libSchema = new Schema({
  path: {
    type: String,
    required: true,
    unique: true
  },
  text: String,
  type: {
    type: String,
    enum: ['ФОТО', 'ВИДЕО'],
    required: true
  }
})

module.exports = mongoose.model('gallery', libSchema, 'gallery')
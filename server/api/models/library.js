const mongoose = require('mongoose')
const Schema = mongoose.Schema

const libSchema = new Schema({
  image: {
    type: String
  },
  author: {
    ref: 'users',
    type: Schema.Types.ObjectId
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  content: [{
    type: {
      type: String,
      enum: ['ТЕКСТ', 'ПРЕЗЕНТАЦИЯ', 'ВИДЕО'],
      required: true
    },
    url: String,
    text: String,
  }],
  visible: Boolean,
  lastChange: {
    author: {
      ref: 'users',
      type: Schema.Types.ObjectId
    },
    time: Date
  },
  path: {
    type: String,
    required: true,
    unique: true
  },
  lastChange: {
    author: {
      ref: 'users',
      type: Schema.Types.ObjectId
    },
    time: Date
  },
})

module.exports = mongoose.model('library', libSchema, 'library')
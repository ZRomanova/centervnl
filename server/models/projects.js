const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  image: {
    type: String
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String
  },
  images: [String],
  date_start: {
    type: Date,
    required: true
  },
  date_end: {
    type: Date
  },
  tags: {
    ref: 'tags',
    type: [mongoose.Types.ObjectId]
  }, 
  location: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('projects', projectSchema)
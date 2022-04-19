const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
  image: {
    type: String
  },
  author: {
    ref: 'users',
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  gallery: [String],
  date: {
    type: Date,
    default: Date.now
  },
  services: {
    ref: 'services',
    type: [mongoose.Types.ObjectId]
  },
  projects: {
    ref: 'projects',
    type: [mongoose.Types.ObjectId]
  },
  partners: {
    ref: 'partners',
    type: [mongoose.Types.ObjectId]
  },
  tags: {
    ref: 'tags',
    type: [mongoose.Types.ObjectId]
  },
  likes: {
    ref: 'users',
    type: [mongoose.Types.ObjectId]
  },
  created: {
    type: Date,
    default: Date.now
  },
  visible: Boolean,
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
  }
})

module.exports = mongoose.model('blog', blogSchema, 'blog')
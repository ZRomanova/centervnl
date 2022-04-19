const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  image: String,
  name: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    ref: 'users',
    type: Schema.Types.ObjectId,
    required: true
  },
  description: String,
  gallery: [String],
  period: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date
    },
  },
  tags: {
    ref: 'tags',
    type: [mongoose.Types.ObjectId]
  },
  partners: {
    ref: 'partners',
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

module.exports = mongoose.model('projects', projectSchema)
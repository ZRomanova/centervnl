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
  description: {
    type: String
  },
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
  created: {
    type: Date,
    default: Date.now
  },
  visible: Boolean,
  path: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('projects', projectSchema)
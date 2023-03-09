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
      type: Date
    },
    end: {
      type: Date
    },
  },
  content: [{
    url: String,
    text: String,
  }],
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
  },
  likes: {
    ref: 'users',
    type: [mongoose.Types.ObjectId]
  },
  is_grant: Boolean,
  programs: [{
    program: {
      ref: 'programs',
      type: Schema.Types.ObjectId
    },
    description: String,
    form: Boolean
  }]
})

module.exports = mongoose.model('projects', projectSchema)
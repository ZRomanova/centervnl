const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportsSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  title: String,
  content: String,
  chapters: [{
    title: String,
    link: String,
    content: String,
    sections: [{
      title: String,
      link: String,
      content: String
    }]
  }],
  created: {
    type: Date,
    default: Date.now
  },
  updated:  Date,
  visible: Boolean
})

module.exports = mongoose.model('reports', reportsSchema)
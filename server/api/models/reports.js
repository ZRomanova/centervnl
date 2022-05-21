const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportsSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  chapters: [{
    title: String,
    sections: [{
      title: String,
      contentType: {
        type: String,
        enum: ["text", "team", "projects"]
      },
      content: Array
    }]
  }],
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  visible: Boolean
})

module.exports = mongoose.model('reports', reportsSchema)
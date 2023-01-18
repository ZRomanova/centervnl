const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  page: String,
  created: {
    type: Date,
    default: Date.now
  },
  answers: [{
    code: String,
    question: String,
    answer: String,
  }]
})

module.exports = mongoose.model('forms', dataSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  question: {
    type: String,
    required: true,
    unique: true
  },
  answer: {
    type: String,
    required: true
  },
  keywords: [String]
})

module.exports = mongoose.model('answers', dataSchema)
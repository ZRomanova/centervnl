const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  page: String,
  answers: [{
    code: String,
    question: String,
    answer: String,
  }]
})

module.exports = mongoose.model('forms', dataSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
  text: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('tags', tagSchema)
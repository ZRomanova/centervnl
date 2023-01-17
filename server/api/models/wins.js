const mongoose = require('mongoose')
const Schema = mongoose.Schema

const winSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  visible: Boolean,
  path: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('wins', winSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  special: Boolean,
  description: String
})

module.exports = mongoose.model('tags', tagSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const docsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  file: String,
  visible: Boolean
})

module.exports = mongoose.model('documents', docsSchema)
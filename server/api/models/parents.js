const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: String,
    // required: true,
  },
  age_text: String,
  gallery: [String],
  description: String,
  visible: Boolean,
  path: {
    type: String,
    required: true,
    unique: true
  },
  text_help: String,
  text_form: String,
  text_library: String,
  text_orgs: String,
  url_library: String,
  orgs: [{
    url: String,
    name: String,
    description: String,
  }]
})

module.exports = mongoose.model('parents', dataSchema)
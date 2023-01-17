const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  gallery: [String],
  description: String,
  image: String,
  icon: String,
  visible: Boolean,
  path: {
    type: String,
    required: true,
    unique: true
  },
  text_1: String,
  text_2: String,
  text_3: String,
  text_4: [String],
  text_5: String,
  text_6: String,
  text_button: String,
  url_button: String,
  subtitle: String,
  video: String,
  phrases: [{
    image: String,
    name: String,
    description: String,
  }]
})

module.exports = mongoose.model('programs', dataSchema)
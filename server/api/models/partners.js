const mongoose = require('mongoose')
const Schema = mongoose.Schema

const partnerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: String,
  image: String,
  visible: Boolean
})

module.exports = mongoose.model('partners', partnerSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const partnerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('partners', partnerSchema)
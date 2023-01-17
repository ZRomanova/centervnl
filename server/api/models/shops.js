const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shopSchema = new Schema({
  name: {
      type: String,
      required: true,
      unique: true
  },
  description: String,
  visible: Boolean,
  image: String,
  path: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('shops', shopSchema)
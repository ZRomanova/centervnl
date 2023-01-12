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
  },
  shop: {
    ref: 'shops',
    type: mongoose.Types.ObjectId,
    required: true
  }
})

module.exports = mongoose.model('catalogs', shopSchema)
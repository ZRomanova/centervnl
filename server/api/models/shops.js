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
  icon: String,
  path: {
    type: String,
    unique: true
  },
  groups: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    visible: Boolean,
    image: String,
    path: {
      type: String,
      unique: true
    },
    products: [{
      name: {
        type: String,
        required: true
      },
      image: String,
      video: String,
      gallery: [String],
      description: String,
      price: Number,
      visible: Boolean,
      options: [{
        name: String,
        variants: [{
          name: String,
          price: Number
        }]
      }],
      path: {
        type: String,
        unique: true
      },
    }]
  }]
})

module.exports = mongoose.model('shops', shopSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pressSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  visible: Boolean,
  date: {
    type: Date,
    default: Date.now
  },
  url: String
})

module.exports = mongoose.model('press', pressSchema)
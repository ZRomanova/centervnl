const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportsSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  finance: String,
  justice: String,
  annual: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated:  Date,
  visible: Boolean
})

module.exports = mongoose.model('reports', reportsSchema)
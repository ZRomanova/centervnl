const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  type: String,
  data: mongoose.Mixed
})

module.exports = mongoose.model('donations', dataSchema)
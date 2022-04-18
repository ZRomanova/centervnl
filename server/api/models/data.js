const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  type: {
      type: String,
      required: true,
      unique: true
  },
  data: mongoose.Mixed

})

module.exports = mongoose.model('infos', dataSchema)
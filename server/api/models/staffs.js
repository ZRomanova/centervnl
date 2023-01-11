const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staffSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  visible: Boolean,
  position: String,
  degree: String,
  path: {
    type: String,
    required: true,
    unique: true
  },
  education: String
})

module.exports = mongoose.model('staffs', staffSchema)
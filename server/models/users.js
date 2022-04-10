const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  patronymic: String,
  sex: Number,
  isAdmin: Boolean,
  photo: {
    type: String,
    default: ''
  },
  info: String,
  emo: mongoose.Types.ObjectId
})

module.exports = mongoose.model('users', userSchema)
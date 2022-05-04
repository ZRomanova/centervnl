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
  photo: String,
  info: String,
  created: {
    type: Date,
    default: Date.now
  },
  emo: mongoose.Types.ObjectId,
  team: {
    ref: 'staffs',
    type: Schema.Types.ObjectId,
  },
})

module.exports = mongoose.model('users', userSchema)
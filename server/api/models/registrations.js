const mongoose = require('mongoose')
const Schema = mongoose.Schema

const registrSchema = new Schema({
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
  },
  status: {
    type: String,
    enum: 'заявка' | 'отмена' | 'участник' | 'неявка' | 'ведущий'
  },
  service: {
    ref: 'services',
    type: mongoose.Types.ObjectId
  },
  date: {
    required: true,
    type: Date
  },
  info: String,
  payment: {
    price: Number,
    description: String,
    method: {
        type: String,
        enum: 'на месте' | 'онлайн'
    },
    paid: Number
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('registrations', registrSchema)
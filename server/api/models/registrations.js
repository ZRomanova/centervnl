const mongoose = require('mongoose')
const Schema = mongoose.Schema

const registrSchema = new Schema({
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
  },
  status: {
    type: String,
    enum: ['заявка', 'отмена', 'участник', 'неявка', 'ведущий'],
    default: 'заявка'
  },
  service: {
    ref: 'services',
    type: mongoose.Types.ObjectId
  },
  date: {
    required: true,
    type: Date
  },
  date_string: String,
  email: String,
  tel: String,
  info: String,
  name: String,
  surname: String,
  patronymic: String,
  roles: String,
  // payment: {
  //   price: Number,
  //   description: String,
  //   status: {
  //     type: String,
  //     enum: ['оплачен', 'не оплачен', 'оплачен частично'],
  //     default: 'не оплачен'
  //   },
  //   method: {
  //       type: String,
  //       enum: ['на месте', 'онлайн'],
  //       default: 'на месте'
  //   },
  //   paid: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('registrations', registrSchema)
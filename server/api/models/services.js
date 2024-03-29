const mongoose = require('mongoose')
const Schema = mongoose.Schema


const serviceSchema = new Schema({
  author: {
    ref: 'users',
    type: Schema.Types.ObjectId,
    required: true
  },
  peopleLimit: Number,
  description: String,
  address: String,
  priceList: [{
    price: {
        type: Number,
        default: 0
    },
    name: String,
    description: String
  }],
  image: {
    type: String
  },
  gallery: {
    type: [String]
  },
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true
  },
  date: {
      single: [Date],
      period: [{
          start: Date,
          end: Date,
          visible: Boolean,
          day: {
            type: String,
            enum: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
          },
          time: Number
      }]
  },
  visible: Boolean,
  path: {
    type: String,
    required: true,
    unique: true
  },
  lastChange: {
    author: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    time: Date
  },
  url: String,
  is_partner: Boolean,
  is_online: Boolean
})


module.exports = mongoose.model('services', serviceSchema)
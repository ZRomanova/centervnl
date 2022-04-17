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
    required: true,
    unique: true
  },
  partners: {
    ref: 'partners',
    type: [mongoose.Types.ObjectId]
  },
  tags: {
    ref: 'tags',
    type: [mongoose.Types.ObjectId]
  },
  projects: {
    ref: 'projects',
    type: [mongoose.Types.ObjectId]
  },
  likes: {
    ref: 'users',
    type: [Schema.Types.ObjectId]
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
  }
})

module.exports = mongoose.model('services', serviceSchema)
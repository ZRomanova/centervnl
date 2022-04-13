const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serviceSchema = new Schema({
  author: {
    ref: 'users',
    type: Schema.Types.ObjectId,
    required: true
  },
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
  title: {
    type: String,
    required: true,
    unique: true
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
          week: {
            monday: [Number],
            tuesday: [Number],
            wednesday: [Number],
            thursday: [Number],
            friday: [Number],
            saturday: [Number],
            sunday: [Number]
          }
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
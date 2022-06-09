const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
    required: true
  },
  day: [String],
  lessons: [String]
})

module.exports = mongoose.model('dk-forms', dataSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
  image: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  images: [String],
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['post', 'event'],
    required: [true, 'Выберите тип! Посты нужны для информирования, на мероприятия можно записаться.']
  },
  event: {
    ref: 'services',
    type: mongoose.Types.ObjectId
  },
  tags: {
    ref: 'tags',
    type: [mongoose.Types.ObjectId]
  }
})

module.exports = mongoose.model('blog', blogSchema, 'blog')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: String,
    gallery: {
        type: [String]
    },
    description: String,
    catalog: String,
    price: Number,
    visible: Boolean,
    options: [{
        name: String,
        variants: [{
            name: String,
            description: String,
            price: Number
        }]
    }],
    created: {
        type: Date,
        default: Date.now
    },
    path: {
      type: String,
      required: true,
      unique: true
    },
    likes: {
      ref: 'users',
      type: [mongoose.Types.ObjectId]
    }
})

module.exports = mongoose.model('products', productSchema)
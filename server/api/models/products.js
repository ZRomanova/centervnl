const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: String,
    video: String,
    // gallery: [String],
    description: String,
    shop: {
        ref: 'shops',
        type: mongoose.Types.ObjectId,
        required: true
    },
    catalog: {
        ref: 'catalogs',
        type: mongoose.Types.ObjectId,
        required: true
    },
    group: String,
    price: Number,
    visible: Boolean,
    options: [{
        name: String,
        variants: [{
            name: String,
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
    // likes: {
    //   ref: 'users',
    //   type: [mongoose.Types.ObjectId]
    // },
    author: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    },
    lastChange: {
        author: {
            ref: 'users',
            type: Schema.Types.ObjectId
        },
        time: Date
    }
})

module.exports = mongoose.model('products', productSchema)
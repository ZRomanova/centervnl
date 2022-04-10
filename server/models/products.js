const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    images: {
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
            price: Number
        }]
    }]
})

module.exports = mongoose.model('products', productSchema)
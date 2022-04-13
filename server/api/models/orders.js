const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
      },
    status: {
        type: String,
        enum: 'в корзине' | 'заказан' | 'выполнен' | 'доставлен'
    },
    description: String,
    address: String,
    products:[{
        name: String,
        price: Number,
        description: String
    }],
    discount: {
        type: String,
        value: String
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('products', productSchema)
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
    info: String,
    payment: {
        price: Number,
        discount: {
            type: String,
            value: String
        },
        status: {
            type: String,
            enum: 'оплачено' | 'не оплачено'
        },
        method: {
            type: String,
            enum: 'на месте' | 'онлайн'
        },
        paid: Number
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('products', productSchema)
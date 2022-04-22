const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
    status: {
        type: String,
        enum: 'в корзине' | 'в работе' | 'выполнен' | 'доставлен' | 'отменен',
        default: 'в корзине'
    },
    description: String,
    address: String,
    products:[{
        name: String,
        price: Number,
        description: String
    }],
    payment: {
        price: Number,
        discount: {
            type: String,
            value: String
        },
        status: {
            type: String,
            enum: 'оплачен' | 'не оплачен' | 'оплачен частично',
            default: 'не оплачен'
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

module.exports = mongoose.model('orders', productSchema)
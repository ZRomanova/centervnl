const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
    status: {
        type: String,
        enum: ['в корзине', 'в работе', 'выполнен', 'доставлен', 'отменен'],
        default: 'в корзине'
    },
    comment: String, //комментарий клиента
    address: String, //адрес доставки
    products:[{
        name: String,
        price: Number,
        count: Number,
        description: String
    }],
    payment: {
        price: Number,
        delivery: Number,
        total: Number,
        discount: {
            type: String,
            value: String
        },
        status: {
            type: String,
            enum: ['оплачен', 'не оплачен', 'оплачен частично'],
            default: 'не оплачен'
        },
        method: {
            type: String,
            enum: ['на месте', 'онлайн']
        },
        paid: Number
    },
    created: {
        type: Date,
        default: Date.now
    },
    send: Date,
    number: Number
})

module.exports = mongoose.model('orders', orderSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
    session: String,

    email: String, 
    tel: String, 
    name: String, 
    surname: String, 
    patronymic: String, 

    org_name: String,
    org_actual_address: String, //фактический адрес
    org_legal_address: String, //Юридический адрес
    org_activity: String,
    org_email: String, 
    org_tel: String, 
    addressee_type: String, 

    status: {
        type: String,
        enum: ['в корзине', 'в работе', 'в доставке', 'доставлен', 'получен', 'отменен'],
        default: 'в корзине'
    },
    address: String, //адрес доставки
    products:[{
        id: Schema.Types.ObjectId,
        options: [Schema.Types.ObjectId],
        name: String,
        image: String,
        price: Number,
        count: Number,
        description: String
    }],
    payment: {
        price: Number,
        delivery: Number,
        total: Number,
        // discount: {
        //     type: String,
        //     value: String
        // },
        status: {
            type: String,
            enum: ['оплачен', 'не оплачен'],
            default: 'не оплачен'
        },
        method: {
            type: String,
            enum: ['Банковский перевод', 'Банковская карта', 'Наличные при получении']
        }
    },
    created: {
        type: Date,
        default: Date.now
    },
    send: Date,
    number: Number
})

module.exports = mongoose.model('orders', orderSchema)
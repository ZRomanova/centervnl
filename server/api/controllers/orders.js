const Order = require('../models/orders')
const Shop = require('../models/shops')
const errorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')
const request = require('request');
const moment = require('moment')
moment.locale('ru')

module.exports.getOrders = async function(req, res, next) {
    try {
        const filter = {}
        const fields = {}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                if (str.slice(-4) == 'user') {
                    filter.user = mongoose.Types.ObjectId(req.query[str])
                } else if (str.slice(-6) == 'number') {
                    if (req.query[str] == 'true') {
                        filter.number = {$exists: true}
                    } else {
                        filter.number = {$exists: false}
                    }
                    
                } else {
                    filter[str.slice(7)] = req.query[str]
                }
            } else if (str.length > 7 && str.substring(0, 7) === "fields_" && (+req.query[str] == 1 || +req.query[str] == 0)) {
                fields[str.slice(7)] = +req.query[str]
            }
        }

        const products = await Order.aggregate([
            { $match: filter },
            { $project: fields },
            { $sort: {group: 1, name: 1}},
            { $skip:  +req.query.offset},
            { $limit:  +req.query.limit},
            { $lookup:
                {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
        ])
        for (const product of products) {
            if (product.user && product.user.length) {
                product.user = product.user[0]
            } else {
                product.user = null
            }
        }
        next(req, res, products)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByUser = async function(req, res, next) {
  try {
      const orders = await Order
      .find({session: req.session._id})
      .sort({send: -1})
      .lean()

      for (const item of orders) {
        item.created = moment(item.created).format('lll')
        if (item.send) item.send = moment(item.send).format('lll')
      }

      next(req, res, orders)
  } catch (e) {
      errorHandler(res, e)
  }
}

module.exports.addToBin = async function(req, res, next) {
  try {
    const isArrEq = (first = [], second = []) => {
        if (first.length !== second.length) return false
        return first.every((value) => second.includes(String(value)))
    }
    // const user = req.user ? req.user.id : null
    // if (!user) {
    //     next(req, res, null)
    //     return
    // }
    // console.log(req.body)

    const shop = await Shop.findOne(
        {"groups.products._id": req.body.product}, 
        {"groups.products.$": 1}
    ).lean()

    const product = shop.groups[0].products.find(item => (item._id == req.body.product))

    let order = await Order.findOne({session: req.sessionID, status: 'в корзине'}).lean()
    
    const ordCurProd = order.products.find(item => item.id == req.body.product && isArrEq(item.options, req.body.options))
    
    let desc_arr = []
    let price = product.price
    product.options.forEach(option => {
        option.variants.forEach(variant => {
            if (req.body.options.includes(String(variant._id))) {
                desc_arr.push(variant.name)
                price *= variant.price
            }
        })
    })


    if (ordCurProd && (ordCurProd.count + Number(req.body.count) > 0)) {
        // console.log('set')
        order = await Order.findOneAndUpdate(
            {session: req.sessionID, status: 'в корзине'},
            {   
                "$set": {
                    "products.$[product].name": product.name,
                    "products.$[product].image": product.image,
                    "products.$[product].description": desc_arr.join(' '),
                    "products.$[product].price": Math.ceil(price),
                },
                "$inc": {
                    "products.$[product].count": Number(req.body.count)
                }
            },
            {
                "arrayFilters": [{ "product.id": req.body.product, "product.options":  ordCurProd.options}],
                new: true
            }
        )
    } else if (ordCurProd && (ordCurProd.count + Number(req.body.count) <= 0)) {
        order = await Order.findOneAndUpdate(
            {session: req.sessionID, status: 'в корзине'},
            {"$pull": 
                {"products": {
                    id: req.body.product,
                    options: ordCurProd.options
                }
            }},
            {new: true}
        )
    } else if (!ordCurProd) {
        // console.log('push')
        order = await Order.findOneAndUpdate(
            {session: req.sessionID, status: 'в корзине'},
            {"$push": 
                {"products": {
                    id: req.body.product,
                    image: product.image,
                    options: req.body.options,
                    name: product.name,
                    description: desc_arr.join(' '),
                    count: Number(req.body.count),
                    price: Math.ceil(price)
                }
            }},
            {new: true}
        )
    }

    next(req, res, order)
  } catch (e) {
    console.log(e)
    errorHandler(res, e)
  }
}

// module.exports.updateBin = async function (req, res, next) {
//     try {
//         let order
//         if (req.body.count) {
//             order = await Order.findOneAndUpdate(
//                 {'products._id': req.params.id}, 
//                 {$inc: {'products.$.count': +req.body.count}}, 
//                 {new: true})
//                 .lean()
//             orderDel = await Order.findOneAndUpdate(
//                 {'products._id': req.params.id}, 
//                 {$pull: {'products': {'count': 0}}},
//                 {new: true}
//                 ).lean()
//             if (orderDel) order = orderDel
//             }
//         else 
//             order = await Order.findOneAndUpdate(
//                 {'products._id': req.params.id}, 
//                 {$pull: {'products': {_id: req.params.id}}},
//                 {new: true}
//                 )
//         next(req, res, order)
//     } catch (e) {
//         errorHandler(res, e)
//     }
// }

module.exports.update = async function(req, res, next) {
    try {
        const updated = req.body
        if (updated.payment.paid >= updated.payment.total) {
            updated.payment.status = 'оплачен'
        } else if (updated.payment.paid) {
            updated.payment.status = 'оплачен частично'
        } else {
            updated.payment.status = 'не оплачен'
        }
        const item = await Order.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, item)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res, next) {
    try {
        const filters = {_id: req.params.id}
        if (req.query.basket == 'only') filters.status = 'в корзине'
        const order = await Order.findOne(filters).lean()

        next(req, res, order)

    } catch (e) {
        errorHandler(res, e)
    }
}

// module.exports.toggleStatus = async function(req, res, next) {
//     try {
//         const lastOrder = await Order.findOne({number: {$exists: true}}).sort({number: -1}).lean()
//         await Order.updateOne(
//             {_id: req.params.id}, 
//             {$set: {
//                 status: 'в работе',
//                 address: req.body.address ? req.body.address : req.body['custom-address'],
//                 send: moment(),
//                 'payment.delivery': req.body.delivery,
//                 'payment.price': req.body.total,
//                 'payment.total': req.body.total,
//                 'payment.method': req.body.method,
//                 'payment.paid': 0,
//                 comment: req.body.comment,
//                 number: lastOrder ? lastOrder.number + 1 : 1
//             }}, 
//             {new: true}
//             )

//         next(req, res, {message: "Обновлено."})
//     } catch (e) {
//         errorHandler(res, e)
//     }
// }


module.exports.getBasketById = async function(req, res, next) {
    try {
        let order = await Order.findOne({session: req.sessionID, status: 'в корзине'}).lean()

        if (!order) {
            order = new Order({session: req.sessionID}).save()
        }

        next(req, res, order)

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.orderNotPay = async function(req, res, data = {}) {
    try {
        const lastOrder = await Order.findOne({number: {$exists: true}}).sort({number: -1}).lean()

        let order = await Order.findOneAndUpdate(
            {session: req.sessionID, status: 'в корзине', "products.0": {"$exists": true}},
            {"$set": {
                // ...req.body,
                send: moment(),
                number: lastOrder ? lastOrder.number + 1 : 1
            }},
            {new: true}
        ).lean()

        if (!order) res.status(404).json({message: "Заказ не найден"})
        
        const total = order.products.reduce((prev, curr) => {
            return prev += (curr.count * curr.price)
        }, 0)

        order = await Order.findOneAndUpdate(
            {number: order.number},
            {"$set": {
                ...req.body,
                "payment.total": total,
                "status": "принят"
            }},
            {new: true}
        ).lean()

        res.status(200).json({next: "finish"})
         
    } catch (e) {
        console.log(e)
    }
}

module.exports.orderPay = async function(req, res, data = {}) {
    try {
        const lastOrder = await Order.findOne({number: {$exists: true}}).sort({number: -1}).lean()

        let order = await Order.findOneAndUpdate(
            {session: req.sessionID, status: 'в корзине', "products.0": {"$exists": true}},
            {"$set": {
                ...req.body["Order"],
                send: moment(),
                number: lastOrder ? lastOrder.number + 1 : 1
            }},
            {new: true}
        ).lean()

        if (!order) res.status(404).json({message: "Заказ не найден"})
        
        const total = order.products.reduce((prev, curr) => {
            return prev += (curr.count * curr.price)
        }, 0)

        request.post('https://api.cloudpayments.ru/payments/cards/charge', {
            headers: {
                "Authorization": "Basic " + Buffer.from("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba").toString('base64')
            },
            json: {
                "Amount": total,
                "Currency":req.body["Currency"],
                "IpAddress": req.body["IpAddress"],
                "Description":req.body["Description"],
                "AccountId":req.body["AccountId"],
                "Email": req.body["Email"],
                "CardCryptogramPacket": req.body["CardCryptogramPacket"],
                "Payer": req.body["Payer"],
                "InvoiceId": order.number
            },
        }, function (error, response, body) {
            let data = {}
            if (!error) {
                let model = body["Model"]
                if (!body["Success"] && body["Model"] && body["Model"]["AcsUrl"]) {

                    Order.updateOne(
                        {session: req.sessionID, status: 'в корзине'},
                        {"$set": {
                            "payment.total": total,
                        }}
                    )

                    data = {
                    "MD": model["TransactionId"],
                    "PaReq": model["PaReq"],
                    "AcsUrl": model["AcsUrl"],
                    "next": "3D"
                    };
                } else if (body["Success"]) {
                    Order.updateOne(
                        {session: req.sessionID, status: 'в корзине'},
                        {"$set": {
                            "payment.status": "оплачен",
                            "payment.total": total,
                            status: 'принят',
                        }}
                    )
                    data = {
                        "next": "finish",
                        "Token": model["Token"]
                    }
                } else {
                    data = {
                        "next": "error",
                        "message": model["CardHolderMessage"]
                    }
                }

            } else {
                data = {
                    ...error,
                    next: "error"
                }
            }
          res.status(200).json(data)
        })

        // res.status(200).json({message: "test"})
         
    } catch (e) {
        console.log(e)
    }
}

module.exports.orderPayFinish = async function(req, res) {
    try {
        request.post('https://api.cloudpayments.ru/payments/cards/post3ds', {
            headers: {
                "Authorization": "Basic " + Buffer.from("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba").toString('base64')
            },
            json: {
                "TransactionId": req.body["MD"],
                "PaRes": req.body["PaRes"]
            },
        }, function (error, response, body) {
            let data = {}
            if (!error) {
                let model = body["Model"]
                if (body["Success"]) {
                    
                    Order.updateOne(
                        {session: req.sessionID, status: 'в корзине'},
                        {"$set": {
                            "payment.status": "оплачен",
                            status: 'принят',
                        }}
                    )

                    res.redirect("/shop/order/finish")
                } else {
                    res.redirect("/shop/order?error="+model["CardHolderMessage"]+'#error-text')
                }

            } else {
                data = {
                    ...error,
                    next: "error"
                }
                res.status(200).json(data)
            }
          
        })
      } catch(e) {
        console.log(e)
      }
}
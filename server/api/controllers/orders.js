const Order = require('../models/orders')
const errorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')
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
      .find({user: req.user._id})
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
    const user = req.user ? req.user.id : null
    if (!user) {
        next(req, res, null)
        return
    }

    const product = req.body && req.body.name ? req.body : null
    let reg
    const order = await Order.findOne({user, status: 'в корзине'}).lean()
    if (product)
        if (order) {
            const curProd = order.products.find(prod => prod.name == product.name && prod.description == product.description)
            if (curProd) {
                const index = order.products.indexOf(curProd)
                reg = await Order.findOneAndUpdate({user, status: 'в корзине'}, {$inc: {["products." + index + ".count"]: product.count}}, {new: true}).lean()
                console.log(reg)
            } else {
                reg = await Order.findOneAndUpdate({user, status: 'в корзине'}, {$addToSet: {products: product}}, {new: true}).lean()
            }
        } else {
            const created = {
                user,
                products: [product]
            }
            reg = await new Order(created).save()
        }
    else {
        if (order) reg = order
        else reg = await new Order({user}).save()
    }

    next(req, res, reg)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.updateBin = async function (req, res, next) {
    try {
        let order
        if (req.body.count) {
            order = await Order.findOneAndUpdate(
                {'products._id': req.params.id}, 
                {$inc: {'products.$.count': +req.body.count}}, 
                {new: true})
                .lean()
            orderDel = await Order.findOneAndUpdate(
                {'products._id': req.params.id}, 
                {$pull: {'products': {'count': 0}}},
                {new: true}
                ).lean()
            if (orderDel) order = orderDel
            }
        else 
            order = await Order.findOneAndUpdate(
                {'products._id': req.params.id}, 
                {$pull: {'products': {_id: req.params.id}}},
                {new: true}
                )
        next(req, res, order)
    } catch (e) {
        errorHandler(res, e)
    }
}

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
        const orders = await Order.aggregate([
            {
                $match: {_id: mongoose.Types.ObjectId(req.params.id)}
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            }
        ])

        if (orders.length){
            const order = orders[0]
            if (order.user.length) order.user = order.user[0]
            next(req, res, order)
        }
        else 
            next(req, res, new Error("Заказ не найден"))
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.toggleStatus = async function(req, res, next) {
    try {
        const lastOrder = await Order.findOne({number: {$exists: true}}).sort({number: -1}).lean()
        await Order.updateOne(
            {_id: req.params.id}, 
            {$set: {
                status: 'в работе',
                address: req.body.address ? req.body.address : req.body['custom-address'],
                send: moment(),
                'payment.delivery': req.body.delivery,
                'payment.price': req.body.total,
                'payment.total': req.body.total,
                'payment.method': req.body.method,
                'payment.paid': 0,
                comment: req.body.comment,
                number: lastOrder ? lastOrder.number + 1 : 1
            }}, 
            {new: true}
            )

        next(req, res, {message: "Обновлено."})
    } catch (e) {
        errorHandler(res, e)
    }
}
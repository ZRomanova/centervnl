const Order = require('../models/orders')
const errorHandler = require('../utils/errorHandler')
const moment = require('moment')
moment.locale('ru')


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
        const service = await Order.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res, next) {
    try {
        const reg = await Order.findById(req.params.id).lean()
        next(req, res, reg)
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
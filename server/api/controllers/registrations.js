const Service = require('../models/services')
const Registration = require('../models/registrations')
const errorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('ru')

module.exports.getByService = async function(req, res, next) {
    try {

        const regs = await Registration.aggregate([
            { $match: {date: new Date(req.params.date), service: mongoose.Types.ObjectId(req.params.service)} }, //
            { $sort: {created: -1}},
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
        for (const reg of regs) {
            if (reg.user && reg.user.length) {
                const user = reg.user[0]
                reg.name = reg.name || user.name
                reg.surname = reg.surname || user.surname
                reg.patronymic = reg.patronymic || user.patronymic
                reg.email = reg.email || user.email
            }
        }

        next(req, res, regs)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getGroups = async function(req, res, next) {
    try {
      const groups = await Registration.distinct("date", {service: req.params.service})
      next(req, res, groups)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByUser = async function(req, res, next) {
  try {
      const now = moment().format()
      const regsActive = await Registration
      .find({user: req.user._id, date: {$gt: new Date(now)}})
      .sort({date: 1})
      .lean()

      const regsInactive = await Registration
      .find({user: req.user._id, date: {$lte: Date(now)}})
      .sort({date: -1})
      .lean()

      for (const item of regsActive) {
          const service = await Service.findById(item.service, 'name address _id peopleLimit').lean()
          item.service = service ? service : null
          if (item.status == 'отмена' || service) item.count = await Registration.countDocuments({date: item.date, service: service._id, status: {$nin: ['отмена', 'ведущий']}})
          item.date = moment(item.date).format('lll')
      }
      for (const item of regsInactive) {
        item.date = moment(item.date).format('lll')
        const service = await Service.findById(item.service, 'name address').lean()
        item.service = service ? service : null
      }

      next(req, res, {regsActive, regsInactive})
  } catch (e) {
      errorHandler(res, e)
  }
}

module.exports.create = async function(req, res, next) {
  try {
    const created = req.body
    // created.user = req.user.id
    created.date = moment(req.body.date)?.toDate();
    created.date_string = moment(req.body.date).format('D MMMM HH:mm')
    console.log(created)
    // let pl = ''
    // if (req.body.priceID) {
    //   const service = await Service.findOne({'priceList._id': req.body.priceID}).lean()
    //   if (service && service.priceList) pl = service.priceList.find(el => String(el._id) == req.body.priceID)
    // }
    // created.payment = {
    //   price: req.body.price,
    //   description: `${pl && pl.name ? pl.name : ''}`.trim(),
    //   status: req.body.price == 0 ? 'оплачен' : req.body.statusPay,
    //   method: req.body.price == 0 ? 'онлайн' : req.body.method
    // }
    await new Registration(created).save()
    next(req, res)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function(req, res, next) {
    try {
        const updated = req.body
        // if (updated.payment.paid >= updated.payment.price) {
        //     updated.payment.status = 'оплачен'
        // } else if (updated.payment.paid) {
        //     updated.payment.status = 'оплачен частично'
        // } else {
        //     updated.payment.status = 'не оплачен'
        // }
        const service = await Registration.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res, next) {
    try {
        const orders = await Registration.aggregate([
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
            },
            {
                $lookup:
                {
                    from: 'services',
                    localField: 'service',
                    foreignField: '_id',
                    as: 'service'
                }
            }
        ])

        if (orders.length){
            const order = orders[0]

            if (order.user && order.user.length) {
                const user = order.user[0]
                order.name = order.name || user.name
                order.surname = order.surname || user.surname
                order.patronymic = order.patronymic || user.patronymic
                order.email = order.email || user.email
            }
            
            if (order.service.length) order.service = order.service[0]
            next(req, res, order)
        }
        else 
            next(req, res, new Error("Запись не найдена"))
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.check = async function(user, date, service) {
  try {
    //   const reg = user ? await Registration.findOne({user: user._id, date, service: service._id}, {_id: 0}).lean() : false
      const regLen = await Registration.countDocuments({date, service: service._id, status: {$nin: ['отмена', 'ведущий']}})
      return {count: regLen}
    //   return {isReg: reg ? true : false, count: regLen}
  } catch (e) {
      console.log(e)
  }
}

module.exports.toggleStatus = async function(req, res, next) {
    try {
        await Registration.updateOne({_id: req.params.id}, {$set: {status: req.params.status}}, {new: true})

        next(req, res, {message: "Обновлено."})
    } catch (e) {
        errorHandler(res, e)
    }
}

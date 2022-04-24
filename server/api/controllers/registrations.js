const Service = require('../models/services')
const Registration = require('../models/registrations')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
const moment = require('moment')
moment.locale('ru')

module.exports.getByService = async function(req, res, next) {
    try {
        const regs = await Service
        .find({service: req.params.service, date: req.params.date})
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .sort({created: -1})
        .lean()

        next(req, res, regs)
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
    created.user = req.user.id
    created.date = moment(req.body.date, 'D MMMM YYYY HH:mm[,] dddd').toDate();
    let pl = ''
    if (req.body.priceID) {
      const service = await Service.findOne({'priceList._id': req.body.priceID}).lean()
      if (service && service.priceList) pl = service.priceList.find(el => String(el._id) == req.body.priceID)
    }
    created.payment = {
      price: req.body.price,
      description: `${pl && pl.name ? pl.name : ''}`.trim(),
      status: req.body.price == 0 ? 'оплачен' : req.body.statusPay,
      method: req.body.price == 0 ? 'онлайн' : req.body.method
    }
    const reg = await new Registration(created).save()
    next(req, res, reg)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function(req, res, next) {
    try {
        const updated = req.body
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
        if (!updated.path) updated.path = cyrillicToTranslit().transform(updated.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const service = await Service.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res, next) {
    try {
        const reg = await Registration.findById(req.params.id).lean()
        next(req, res, reg)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.check = async function(user, date, service) {
  try {
      const reg = user ? await Registration.findOne({user: user._id, date, service: service._id}, {_id: 0}).lean() : false
      const regLen = await Registration.countDocuments({date, service: service._id, status: {$nin: ['отмена', 'ведущий']}})
      return {isReg: reg ? true : false, count: regLen}
  } catch (e) {
      console.log(e)
  }
}


module.exports.delete = async function(req, res, next) {
    try {
        await Registration.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
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

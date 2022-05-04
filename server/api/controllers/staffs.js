const Staff = require('../models/staffs')
const User = require('../models/users')
const errorHandler = require('../utils/errorHandler')

module.exports.getStaffs = async function(req, res, next) {
    try {
        const filter = {}
        if (req.query.visible) filter.visible = true
        const partners = await Staff.find(filter).skip(+req.query.offset).limit(+req.query.limit).lean()
        next(req, res, partners)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getStaffById = async function(req, res, next) {
    try {
        const staff = await Staff.findById(req.params.id).lean()
        next(req, res, staff)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createStaff = async function(req, res, next) {
    try {
        const created = req.body
        const staff = await new Staff(created).save()
        next(req, res, staff)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.addStaff = async function(req, res, next) {
    try {
        const created = req.body
        const staff = await new Staff(created).save()
        await User.updateOne({_id: req.params.id}, {$set: {team: staff._id}}, {new: true})
        next(req, res, staff)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteStaff = async function(req, res, next) {
    try {
        await Staff.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateStaff = async function(req, res, next) {
    try {
        const updated = req.body
        const staff = await Staff.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, staff)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesStaff = async function(req, res, next) {
    try {
        const updated = {}
        if (req.file) updated.image = 'https://centervnl.ru/uploads/' + req.file.filename
        const staff = await Staff.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, staff)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getPositions = async function(req, res, next) {
    try {
      const positions = await Staff.distinct("position", {})
      next(req, res, positions)
    } catch (e) {
        errorHandler(res, e)
    }
}

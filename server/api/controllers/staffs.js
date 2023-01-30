const Staff = require('../models/staffs')
const User = require('../models/users')
const translit = require('../utils/translit')
const errorHandler = require('../utils/errorHandler')

module.exports.getStaffs = async function(req, res, next) {
    try {
        const filter = {}
        const fields = {}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                filter[str.slice(7)] = req.query[str]
            } else if (str.length > 7 && str.substring(0, 7) === "fields_" && (+req.query[str] == 1 || +req.query[str] == 0)) {
                fields[str.slice(7)] = +req.query[str]
            }
        }
        const team = await Staff.find(filter, fields).skip(+req.query.offset).limit(+req.query.limit).lean()
        next(req, res, team)
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
        if (!created.path) created.path = translit(`${created.name}-${created.surname}`)
        else created.path = translit(created.path)
        const staff = await new Staff(created).save()
        next(req, res, staff)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.addStaff = async function(req, res, next) {
    try {
        const created = req.body
        created.path = translit(`${created.name}-${created.surname}`)
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
        if (!updated.path) updated.path = translit(`${updated.name}-${updated.surname}`)
        else updated.path = translit(updated.path)
        
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

module.exports.getStaffByPath = async function(req, res, next) {
    try {
        const staff = await Staff.findOne(
            {path: req.params.path, visible: true}
        )
        if (staff){     
            next(req, res, staff)
        }
        else 
            next(req, res, new Error("Не найдено"))
    } catch (e) {
        errorHandler(res, e)
    }
}

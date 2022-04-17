const Service = require('../models/services')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
const moment = require('moment')

module.exports.getAnouncements = async function(req, res, next) {
    try {
        const start = moment().startOf('day');
        const end = moment(start).startOf('day');
        const аnouncements = await Service.find({
            visible: true, 
            $or: [{
                'date.single': {$gt: start}
                },{
                'date.period': {
                    $elemMatch: {
                        start: {$lt: start}, 
                        $or: [{end: {$gt: end}}, {end: null}, {end: {$exists: false}}], 
                        time: {$exists: true},
                        day: {$exists: true},
                        visible: true
                    }
                }
            }
        ]}).lean()
        next(req, res, аnouncements)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getServices = async function(req, res, next) {
    try {
        const filter = {}
        const fields = {}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                filter[str.slice(7)] = +req.query[str]
            } else if (str.length > 7 && str.substring(0, 7) === "fields_" && (+req.query[str] == 1 || +req.query[str] == 0)) {
                fields[str.slice(7)] = +req.query[str]
            }
        }
        const services = await Service
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .sort({created: -1})
        .lean()

        next(req, res, services)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createService = async function(req, res, next) {
    try {
        const created = req.body
        created.author = req.user.id
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase()
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase()
        const service = await new Service(created).save()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateService = async function(req, res, next) {
    try {
        const updated = req.body
        updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase()
        const service = await Service.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getServiceById = async function(req, res, next) {
    try {
        const service = await Service.findById(req.params.id).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getServiceByPath = async function(req, res, next) {
    try {
        const service = await Service.findOne({path: req.params.path, visible: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesService = async function(req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }
        const service = await Service.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteService = async function(req, res, next) {
    try {
        await Service.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}
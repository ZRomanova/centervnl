const Service = require('../models/services')
const errorHandler = require('../utils/errorHandler')

module.exports.getAnouncements = async function(req, res, next) {
    try {
        const now = new Date()
        const аnouncements = await Service.find({
            visible: true, 
            $or: [{
                'date.single': {$gt: now}
                },{
                'date.period': {
                    $elemMatch: {
                        start: {$lt: now}, 
                        end: {$gt: now}, 
                        $or: [
                            {'week.monday.0': {$exists: true}}, 
                            {'week.tuesday.0': {$exists: true}}, 
                            {'week.wednesday.0': {$exists: true}}, 
                            {'week.thursday.0': {$exists: true}}, 
                            {'week.friday.0': {$exists: true}}, 
                            {'week.saturday.0': {$exists: true}}, 
                            {'week.sunday.0': {$exists: true}}
                        ]
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
        const fields = {_id: 1}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                filter[str.slice(7)] = req.query[str]
            } else if (str.length > 7 && str.substring(0, 7) === "fields_" && (+req.query[str] == 1 || +req.query[str] == 0)) {
                fields[str.slice(7)] = req.query[str]
            }
        }
        const services = await Service
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .lean()

        next(req, res, services)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createService = async function(req, res, next) {
    try {
        const created = req.body
        const service = await new Service(created).save()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateService = async function(req, res, next) {
    try {
        const updated = req.body
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


module.exports.uploadImagesService = async function(req, res, next) {
    try {
        const updated = req.body
        if (req.files && req.files.image) updated.image = req.file.image[0].path
        if (req.files['galley']) {
            let paths = req.files['galley'].map(file => file.filename)
            if (!req.body.galley) updated.galley = paths
            else updated.galley = [...updated.galley, ...paths]
        }
        const service = await Service.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}
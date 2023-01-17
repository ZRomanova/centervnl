const Report = require('../models/reports')
const errorHandler = require('../utils/errorHandler')

module.exports.getReports = async function(req, res, next) {
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
        const reports = await Report.find(filter, fields).sort({year: -1}).lean()
        next(req, res, reports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getReportById = async function(req, res, next) {
    try {
        const report = await Report.findById(req.params.id).lean()
        next(req, res, report)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getReportByYear = async function(req, res, next) {
    try {
        const report = await Report.findOne({year: req.params.year, visible: true}).lean()
        next(req, res, report)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createReport = async function(req, res, next) {
    try {
        const created = req.body
        const report = await new Report(created).save()
        next(req, res, report)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateReport = async function(req, res, next) {
    try {
        const updated = req.body
        updated.updated = new Date()
        const report = await Report.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, report)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getYears = async function(req, res, next) {
    try {
      const positions = await Report.distinct("year", {visible: true})
      next(req, res, positions)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadFilesReport = async function(req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.finance) updated['$set'] = {finance: 'https://centervnl.ru/uploads/' + req.files.finance[0].filename}
        if (req.files && req.files.justice) updated['$set'] = {justice: 'https://centervnl.ru/uploads/' + req.files.justice[0].filename}
        if (req.files && req.files.annual) updated['$set'] = {annual: 'https://centervnl.ru/uploads/' + req.files.annual[0].filename}

        const report = await Report.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, report)
    } catch (e) {
        errorHandler(res, e)
    }
}
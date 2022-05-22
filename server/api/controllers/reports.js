const Report = require('../models/reports')
const errorHandler = require('../utils/errorHandler')

module.exports.getReports = async function(req, res, next) {
    try {
        const filter = {}
        if (req.query.visible) filter.visible = true
        const reports = await Report.find(filter).sort({year: -1}).lean()
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

module.exports.getChapters = async function(req, res, next) {
    try {
      const positions = await Report.distinct("chapters.title", {})
      next(req, res, positions)
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

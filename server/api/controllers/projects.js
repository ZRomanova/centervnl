const Project = require('../../models/projects')
const errorHandler = require('../utils/errorHandler')

module.exports.getActive = async function(req, res, next) {
    try {
        const now = new Date()
        const activeProjects = await Project.find({$or: [{date_end: {$exists: false}}, {date_end: {$gt: now}}]}).sort({date: -1}).lean()
        next(req, res, activeProjects)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getProjects = async function(req, res, next) {
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
        const projects = await Project
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .sort({date_end: -1})
        .lean()

        next(req, res, projects)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.uploadImages = async function(req, res, next) {
    try {
        const updated = req.body
        if (req.files && req.files.image) updated.image = req.file.image[0].path
        if (req.files['images']) {
            let paths = req.files['images'].map(file => file.filename)
            if (!req.body.images) updated.images = paths
            else updated.images = [...updated.images, ...paths]
        }
        const project = await Project.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}
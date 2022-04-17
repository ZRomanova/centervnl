const Project = require('../models/projects')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
const moment = require('moment')

module.exports.getActive = async function(req, res, next) {
    try {
        const start = moment().startOf('day');
        const end = moment(start).startOf('day');

        const activeProjects = await Project.find({
            visible: true, 
            'period.start': {$lte: start}, 
            $or: [
                {'period.end': {$exists: false}}, 
                {'period.end': null},
                {'period.end': {$gte: end}}
            ]
        }).sort({name: 1}).lean()
        next(req, res, activeProjects)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getProjectById = async function(req, res, next) {
    try {
        const project = await Project.findById(req.params.id).lean()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getProjects = async function(req, res, next) {
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

        const projects = await Project
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .sort({'period.start': -1, created: -1})
        .lean()

        next(req, res, projects)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createProject = async function(req, res, next) {
    try {
        const created = req.body
        created.author = req.user.id
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase()
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase()
        const project = await new Project(created).save()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateProject = async function(req, res, next) {
    try {
        const updated = req.body
        updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase()
        const project = await Project.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteProject = async function(req, res, next) {
    try {
        await Project.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.uploadImagesProject = async function(req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/' + req.files.image[0].path}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/' + file.path)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }
        const project = await Project.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}
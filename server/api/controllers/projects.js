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

module.exports.getProjectByPath = async function(req, res, next) {
    try {
        const project = await Project.findOne(
            {path: req.params.path, visible: true},
            {created: 0, author: 0}
        )
        if (project){     
            next(req, res, project)
        }
        else 
            next(req, res, new Error("Проект не найден"))
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getProjectById = async function(req, res, next) {
    try {
        const project = await Project.findOne({_id: req.params.id})
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
                filter[str.slice(7)] = req.query[str]
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
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const project = await new Project(created).save()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateProject = async function(req, res, next) {
    try {
        const updated = req.body
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
        if (!updated.path) updated.path = cyrillicToTranslit().transform(updated.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
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
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }
        const project = await Project.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.toggleLike = async function(req, res, next) {
    try {
        const like = req.body.like
        if (like) 
            await Project.updateOne({path: req.params.id}, {$addToSet: {likes: req.user._id}}, {new: true})
        else
            await Project.updateOne({path: req.params.id}, {$pull: {likes: req.user._id}}, {new: true})
        next(req, res, {message: "Обновлено."})
    } catch (e) {
        errorHandler(res, e)
    }
}
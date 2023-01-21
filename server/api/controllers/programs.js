
const Program = require('../models/programs')
const Project = require('../models/projects')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
// const moment = require('moment')

module.exports.getProgramByPath = async function(req, res, next) {
    try {
        const program = await Program.findOne(
            {
                path: req.params.path, visible: true
            },
            { 
               "created": 0, author: 0 
            }
        )
        if (program){
            const projects = await Project.find(
                {"programs.program": program._id, visible: true}, 
                {programs: 1, name: 1, path: 1, description: 1, image: 1}
            ).sort({'period.start': -1, created: -1}).lean()
            projects.forEach(project => {
                const currProj = project.programs.find(p => String(p.program) == String(program._id))
                if (currProj && currProj.description) {
                    project.description = currProj.description
                }
            })
            program.projects = projects
            next(req, res, program)
        }
        else 
            next(req, res, new Error("Программа не найдена"))
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getProgramById = async function(req, res, next) {
    try {
        const project = await Program.findOne({_id: req.params.id})
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getPrograms = async function(req, res, next) {
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

        const projects = await Program
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .lean()

        next(req, res, projects)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createProgram = async function(req, res, next) {
    try {
        const created = req.body
        created.author = req.user.id
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const project = await new Program(created).save()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateProgram = async function(req, res, next) {
    try {
        const updated = req.body
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
        if (!updated.path) updated.path = cyrillicToTranslit().transform(updated.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const project = await Program.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteProgram = async function(req, res, next) {
    try {
        await Program.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesProgram = async function(req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }
        const project = await Program.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, project)
    } catch (e) {
        errorHandler(res, e)
    }
}

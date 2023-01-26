const Page = require('../models/parents')
const errorHandler = require('../utils/errorHandler')
const translit = require('../utils/translit')
// const moment = require('moment')

module.exports.getPageByPath = async function(req, res, next) {
    try {
        const page = await Page.findOne(
            {
                path: req.params.path, visible: true
            },
            { 
               "created": 0, author: 0 
            }
        )
        if (page){
            next(req, res, page)
        }
        else 
            next(req, res, new Error("Не найдено"))
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getPageById = async function(req, res, next) {
    try {
        const page = await Page.findOne({_id: req.params.id})
        next(req, res, page)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getPages = async function(req, res, next) {
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

        const pages = await Page
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .lean()

        next(req, res, pages)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createPage = async function(req, res, next) {
    try {
        const created = req.body
        created.author = req.user.id
        if (!created.path) created.path = translit(created.name)
        else created.path = translit(created.path)
        const page = await new Page(created).save()
        next(req, res, page)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updatePage = async function(req, res, next) {
    try {
        const updated = req.body
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
        if (!updated.path) updated.path = translit(updated.name)
        else updated.path = translit(updated.path)
        const page = await Page.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, page)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deletePage = async function(req, res, next) {
    try {
        await Page.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesPage = async function(req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }
        const page = await Page.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, page)
    } catch (e) {
        errorHandler(res, e)
    }
}
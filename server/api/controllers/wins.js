const Document = require('../models/wins')
const errorHandler = require('../utils/errorHandler')
const translit = require('../utils/translit')

module.exports.getWins = async function(req, res, next) {
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
        const docs = await Document.find(filter, fields).lean()
        next(req, res, docs)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getWinById = async function(req, res, next) {
    try {
        const doc = await Document.findById(req.params.id).lean()
        next(req, res, doc)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createWin = async function(req, res, next) {
    try {
        const created = req.body
        if (!created.path) created.path = translit(created.name)
        else created.path = translit(created.path)
        const doc = await new Document(created).save()
        next(req, res, doc)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteWin = async function(req, res, next) {
    try {
        await Document.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateWin = async function(req, res, next) {
    try {
        const updated = req.body
        if (!updated.path) updated.path = translit(updated.name)
        else updated.path = translit(updated.path)
        const doc = await Document.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, doc)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesWins = async function(req, res, next) {
    try {
        const updated = {}
        if (req.file) updated.image = 'https://centervnl.ru/uploads/' + req.file.filename
        const item = await Document.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, item)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getWinByPath = async function(req, res, next) {
    try {
        const item = await Document.findOne(
            {path: req.params.path, visible: true}
        )
        if (item){     
            next(req, res, item)
        }
        else 
            next(req, res, new Error("Не найдено"))
    } catch (e) {
        errorHandler(res, e)
    }
}

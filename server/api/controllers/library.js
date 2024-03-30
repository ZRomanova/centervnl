const Library = require('../models/library')
const errorHandler = require('../utils/errorHandler')
const translit = require('../utils/translit')

module.exports.getLibrarys = async function (req, res, next) {
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
        const library = await Library
            .find(filter, fields)
            .skip(+req.query.offset)
            .limit(+req.query.limit)
            .sort({ date: -1, created: -1 })
            .lean()

        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.countLibrarys = async function (req, res, next) {
    try {
        const filter = {}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                filter[str.slice(7)] = req.query[str]
            }
        }
        const library = await Library.count(filter)


        next(req, res, { count: library })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getLibraryById = async function (req, res, next) {
    try {
        const library = await Library.findById(req.params.id).lean()
        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createLibrary = async function (req, res, next) {
    try {
        const created = req.body
        created.author = req.user.id
        if (!created.path) created.path = translit(created.name)
        else created.path = translit(created.path)
        const library = await new Library(created).save()
        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateLibrary = async function (req, res, next) {
    try {
        const updated = req.body
        if (!updated.path) updated.path = translit(updated.name)
        else updated.path = translit(updated.path)
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
        const library = await Library.findOneAndUpdate({ _id: req.params.id }, { $set: updated }, { new: true }).lean()
        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteLibrary = async function (req, res, next) {
    try {
        await Library.deleteOne({ _id: req.params.id })
        next(req, res, { message: "Удалено" })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesLibrary = async function (req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.image) updated['$set'] = { image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename }
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
            updated['$addToSet'] = { gallery: { $each: paths } }
        }

        const library = await Library.findOneAndUpdate({ _id: req.params.id }, updated, { new: true }).lean()
        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getLibraryByPath = async function (req, res, next) {
    try {
        const library = await Library.findOne(
            {
                path: req.params.path, visible: true
            },
            {
                "created": 0, author: 0, lastChange: 0
            }
        ).lean()
        if (library) {
            next(req, res, library)
        }
        else
            next(req, res, new Error("Не найдено"))
    } catch (e) {
        errorHandler(res, e)
    }
}
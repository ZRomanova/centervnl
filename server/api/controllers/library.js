const Library = require('../models/library')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')

module.exports.getLibrarys = async function(req, res, next) {
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
        .sort({date: -1, created: -1})
        .lean()

        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getLibraryById = async function(req, res, next) {
    try {
        const library = await Library.findById(req.params.id).lean()
        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createLibrary = async function(req, res, next) {
    try {
        const created = req.body
        created.author = req.user.id
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const library = await new Library(created).save()
        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateLibrary = async function(req, res, next) {
    try {
        const updated = req.body
        if (!updated.path) updated.path = cyrillicToTranslit().transform(updated.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
        const library = await Library.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, library)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteLibrary = async function(req, res, next) {
    try {
        await Library.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesLibrary = async function(req, res, next) {
  try {
    const updated = {}
    if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename}
    if (req.files && req.files['gallery']) {
      let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
      updated['$addToSet'] = {gallery: {$each: paths}}
    }

    const library = await Library.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
    next(req, res, library)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.getLibraryByPath = async function(req, res, next) {
    try {
        const library = await Library.findOne(
            {
                path: req.params.path, visible: true
            },
            { 
                "created": 0, author: 0 
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
const Data = require('../models/data')
const errorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose');

module.exports.getByType = async function(req, res, next) {
    try {
        const info = await Data.findOne({type: req.params.type}, {data: 1, _id: 0}).lean()
        next(req, res, info.data)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateByType = async function(req, res, next) {
    try {
        const data = await Data.findOneAndUpdate({type: req.params.type}, {$set: {data: req.body}}, {new: true}).lean()
        next(req, res, data)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.addToGallery = async function(req, res, next) {
    try {
        const updated = req.body
        const id = mongoose.Types.ObjectId();
        updated._id = id
        updated.visible = !!updated.visible
        if (req.file) updated.image = 'https://centervnl.ru/uploads/' + req.file.filename
        const data = await Data.findOneAndUpdate({type: "GALLERY"}, {$push: {data: updated}}, {new: true}).lean()
        next(req, res, data.data)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeFormGallery = async function(req, res, next) {
    try {
        const id = mongoose.Types.ObjectId(req.params.id)
        await Data.updateMany(
            {'data._id': id}, 
            {$pull: {'data': {_id: id}}},
            {multi: true}
            )
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateInGallery = async function(req, res, next) {
    try {
        const id = mongoose.Types.ObjectId(req.params.id)
        const updated = req.body
        updated.visible = updated.visible == "true" ? true : false
        updated._id = id

        if (req.file) updated.image = 'https://centervnl.ru/uploads/' + req.file.filename
        await Data.updateMany(
            {'data._id': id},
            { $set:  {'data.$': updated} },
            {multi: true}
        )
        next(req, res, {message: "Обновлено"})
    } catch (e) {
        errorHandler(res, e)
    }
}


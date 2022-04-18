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
        await Data.findOneAndUpdate({'data._id': req.params.id}, {$pull: {'data.$': req.params.id}} , {new: true}).lean()
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateInGallery = async function(req, res, next) {
    try {
        const updated = req.body
        updated.visible = !!updated.visible

        if (req.file) updated.image = 'https://centervnl.ru/uploads/' + req.file.filename
        const data = await Data.findOne(
            {'data._id': req.params.id},
            { $set: { 'data.$': updated } },
            {new: true}
        ).lean()
        next(req, res, data.data)
    } catch (e) {
        errorHandler(res, e)
    }
}


const Tag = require('../models/tags')
const errorHandler = require('../utils/errorHandler')


module.exports.getTags = async function(req, res, next) {
    try {
        const partners = await Tag.find().sort({name: 1}).lean()
        next(req, res, partners)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getTagById = async function(req, res, next) {
    try {
        const tag = await Tag.findById(req.params.id).lean()
        next(req, res, tag)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createTag = async function(req, res, next) {
    try {
        const created = req.body
        created.spetial = false
        const tag = await new Tag(created).save()
        next(req, res, tag)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteTag = async function(req, res, next) {
    try {
        const tag = await Tag.findById(req.params.id).lean()
        if (!tag.spetial) {
            await Tag.deleteOne({_id: req.params.id})
            next(req, res, {message: "Удалено"})
        }
        next(req, res, {message: "Специальные теги нельзя удалять"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateTag = async function(req, res, next) {
    try {
        const tag = await Tag.findById(req.params.id).lean()
        if (!tag.spetial) {
            const updated = req.body
            updated.spetial = false
            const tag = await Tag.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
            next(req, res, tag)
        }
        next(req, res, {message: "Специальные теги нельзя изменять"})
    } catch (e) {
        errorHandler(res, e)
    }
}

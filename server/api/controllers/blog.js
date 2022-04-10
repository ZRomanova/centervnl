const Blog = require('../../models/blog')
const errorHandler = require('../utils/errorHandler')

module.exports.getPosts = async function(req, res, next) {
    try {
        const filter = {}
        const fields = {_id: 1}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                filter[str.slice(7)] = req.query[str]
            } else if (str.length > 7 && str.substring(0, 7) === "fields_" && (+req.query[str] == 1 || +req.query[str] == 0)) {
                fields[str.slice(7)] = req.query[str]
            }
        }
        const posts = await Blog
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .sort({date: -1})
        .lean()

        next(req, res, posts)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImages = async function(req, res, next) {
    try {
        const updated = req.body
        if (req.files && req.files.image) updated.image = req.file.image[0].path
        if (req.files['images']) {
            let paths = req.files['images'].map(file => file.filename)
            if (!req.body.images) updated.images = paths
            else updated.images = [...updated.images, ...paths]
        }
        const post = await Blog.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAnouncements = async function(req, res, next) {
    try {
        next(req, res, [])
    } catch (e) {
        errorHandler(res, e)
    }
}
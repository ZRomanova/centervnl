const Post = require('../models/posts')
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
        const posts = await Post
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

module.exports.getPostById = async function(req, res, next) {
    try {
        const post = await Post.findById(req.params.id).lean()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createPost = async function(req, res, next) {
    try {
        const created = req.body
        const post = await new Post(created).save()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updatePost = async function(req, res, next) {
    try {
        const updated = req.body
        const post = await Post.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesPost = async function(req, res, next) {
    try {
        const updated = req.body
        if (req.files && req.files.image) updated.image = req.file.image[0].path
        if (req.files && req.files['galley']) {
            let paths = req.files['galley'].map(file => file.filename)
            if (!req.body.galley) updated.galley = paths
            else updated.galley = [...updated.galley, ...paths]
        }
        const post = await Post.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}
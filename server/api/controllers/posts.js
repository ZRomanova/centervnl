const Post = require('../models/posts')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')

module.exports.getPosts = async function(req, res, next) {
    try {
        const filter = {}
        const fields = {}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                filter[str.slice(7)] = +req.query[str]
            } else if (str.length > 7 && str.substring(0, 7) === "fields_" && (+req.query[str] == 1 || +req.query[str] == 0)) {
                fields[str.slice(7)] = +req.query[str]
            }
        }
        const posts = await Post
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .sort({date: -1, created: -1})
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
        created.author = req.user.id
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase()
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase()
        const post = await new Post(created).save()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updatePost = async function(req, res, next) {
    try {
        const updated = req.body
        updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase()
        const post = await Post.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deletePost = async function(req, res, next) {
    try {
        await Post.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesPost = async function(req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/' + req.files.image[0].path}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/' + file.path)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }

        const post = await Post.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}
const Post = require('../models/posts')
const errorHandler = require('../utils/errorHandler')
const translit = require('../utils/translit')

module.exports.getPosts = async function(req, res, next) {
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
        if (!created.path) created.path = translit(created.name, "-")
        else created.path = translit(created.path, "-")
        const post = await new Post(created).save()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updatePost = async function(req, res, next) {
    try {
        const updated = req.body
        if (!updated.path) updated.path = translit(updated.name)
        else updated.path = translit(updated.path)
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
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
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }

        const post = await Post.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getPostByPath = async function(req, res, next) {
    try {
        const posts = await Post.aggregate([
            {
                $match: {path: req.params.path, visible: true}
            },
            { 
                $project: { "created": 0, author: 0 }
            }
        ])
        if (posts.length){
            const post = posts[0]
            next(req, res, post)
        }
        else 
            next(req, res, new Error("Пост не найден"))
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.toggleLike = async function(req, res, next) {
    try {
        const like = req.body.like
        if (like) 
            await Post.updateOne({path: req.params.id}, {$addToSet: {likes: req.user._id}}, {new: true})
        else
            await Post.updateOne({path: req.params.id}, {$pull: {likes: req.user._id}}, {new: true})
        next(req, res, {message: "Обновлено."})
    } catch (e) {
        errorHandler(res, e)
    }
}
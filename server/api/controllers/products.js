const Product = require('../models/products')
const Shop = require('../models/shops')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
const mongoose = require('mongoose')

module.exports.getProductOne = async function(req, res, next) {
    try {
        const id = mongoose.isValidObjectId(req.params.id) ? mongoose.Types.ObjectId(req.params.id) : req.params.id
        const products = await Product.aggregate([
            {
                $match: {$or: [{path: req.params.id}, {_id: id}]}
            },
            {
                $lookup:
                {
                    from: 'shops',
                    localField: 'shop',
                    foreignField: '_id',
                    as: 'shop'
                }
            }
        ])
        if (products.length){
            const product = products[0]
            if (product.shop.length) product.shop = product.shop[0]
            next(req, res, product)
        }
        else 
            next(req, res, new Error("Товар не найден"))
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getProducts = async function(req, res, next) {
    try {
        const filter = {}
        const fields = {}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                if (str.slice(-4) == 'shop') {
                    filter.shop = mongoose.Types.ObjectId(req.query[str])
                } else {
                    filter[str.slice(7)] = req.query[str]
                }
            } else if (str.length > 7 && str.substring(0, 7) === "fields_" && (+req.query[str] == 1 || +req.query[str] == 0)) {
                fields[str.slice(7)] = +req.query[str]
            }
        }

        const products = await Product.aggregate([
            { $match: filter },
            { $project: fields },
            { $sort: {group: 1, name: 1}},
            { $skip:  +req.query.offset},
            { $limit:  +req.query.limit},
            { $lookup:
                {
                    from: 'shops',
                    localField: 'shop',
                    foreignField: '_id',
                    as: 'shop'
                }
            },
            
        ])

        for (const product of products) {
            if (product.shop && product.shop.length) {
                product.shop = product.shop[0]
            }
        }
        next(req, res, products)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createProduct = async function(req, res, next) {
    try {
        const created = req.body
        created.author = req.user.id
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const product = await new Product(created).save()
        next(req, res, product)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateProduct = async function(req, res, next) {
    try {
        const updated = req.body
        if (!updated.path) updated.path = cyrillicToTranslit().transform(updated.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
        const product = await Product.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, product)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteProduct = async function(req, res, next) {
    try {
        await Product.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesProduct = async function(req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }
        const product = await Product.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, product)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.toggleLike = async function(req, res, next) {
    try {
        const like = req.body.like
        if (like) 
            await Product.updateOne({path: req.params.id}, {$addToSet: {likes: req.user._id}}, {new: true})
        else
            await Product.updateOne({path: req.params.id}, {$pull: {likes: req.user._id}}, {new: true})
        next(req, res, {message: "Обновлено."})
    } catch (e) {
        errorHandler(res, e)
    }
}
const Shop = require('../models/shops')
const errorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')
const translit = require('../utils/translit')

function isValidObjectID(str) {
    str = str + '';
    var len = str.length, valid = false;
    if (len == 12 || len == 24) {
        valid = /^[0-9a-fA-F]+$/.test(str);
    }
    return valid;
}

module.exports.getProductById = async function (req, res, next) {
    try {
        const filter = {}
        if (req.params.id && isValidObjectID(req.params.id)) {
            filter["groups.products._id"] = mongoose.Types.ObjectId(req.params.id)
        } else if (req.params.id) {
            filter["groups.products.path"] = req.params.id
        }

        const shop = await Shop.findOne(
            filter,
            { "groups.products.$": 1 }
        ).lean()

        const product = shop.groups[0].products.find(item => (item._id == req.params.id || item.path == req.params.id))


        if (product) {
            product.shop_id = shop._id
            next(req, res, product)
        }
        else next(req, res, new Error("Товар не найден"))
    } catch (e) {
        console.log(e)
        errorHandler(res, e)
    }
}

module.exports.getProducts = async function (req, res, next) {
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


        const shops = await Shop.find(filter, fields).lean()

        const products = shops.reduce(function (result, shop) {
            return [
                ...result,

                ...shop.groups.reduce(function (groups, group) {
                    return [
                        ...groups,

                        ...group.products.reduce(function (products, product) {
                            return [
                                ...products,
                                {
                                    ...product,
                                    group: group.name,
                                }
                            ]
                        }, [])


                    ]
                }, [])
            ]
        }, [])

        next(req, res, products)
    } catch (e) {
        console.log(e)
        errorHandler(res, e)
    }
}

module.exports.createProduct = async function (req, res, next) {
    try {
        const created = req.body
        created._id = mongoose.Types.ObjectId()
        if (created.path) created.path = translit(created.path)
        else if (created.name) created.path = translit(created.name)
        else created.name = "Новый продукт"

        await Shop.findOneAndUpdate({ "groups._id": created.group_id }, { "$push": { "groups.$.products": created } }, { new: true }).lean()

        next(req, res, created)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateProduct = async function (req, res, next) {
    try {
        const item = req.body
        if (!item.path) item.path = translit(item.name)
        else item.path = translit(item.path)

        item._id = mongoose.Types.ObjectId(req.params.id)

        const shop = await Shop.findOneAndUpdate(
            { "groups.products._id": req.params.id },
            { "$set": { "groups.$.products.$[product]": item } },
            {
                "arrayFilters": [{ "product._id": req.params.id }],
                new: true
            })

        item.shop_id = shop._id
        next(req, res, item)
    } catch (e) {
        console.log(e)
        errorHandler(res, e)
    }
}

module.exports.uploadImagesProduct = async function (req, res, next) {
    try {
        const updated = {}
        const item = {}
        if (req.files && req.files.image) {
            updated["groups.$.products.$[product].image"] = 'https://centervnl.ru/uploads/' + req.files.image[0].filename
            item.image = 'https://centervnl.ru/uploads/' + req.files.image[0].filename
        }
        // if (req.files && req.files['gallery']) {
        //     let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
        //     updated["groups.$.products.$[product].gallery"] = {"$addToSet":  {$each: paths}}
        //     item.gallery = paths
        // }


        const shop = await Shop.findOneAndUpdate(
            { "groups.products._id": req.params.id },
            { "$set": updated },
            {
                "arrayFilters": [{ "product._id": req.params.id }],
                new: true
            })

        console.log(shop.groups[0].products)
        // const product = await Product.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, item)
    } catch (e) {
        errorHandler(res, e)
    }
}
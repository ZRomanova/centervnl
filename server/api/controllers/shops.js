const Shop = require('../models/shops')
const Product = require('../models/products')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')


module.exports.getShops = async function(req, res, next) {
    try {
        const shops = await Shop.find().sort({name: 1}).lean()
        next(req, res, shops)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getShopById = async function(req, res, next) {
    try {
        const shop = await Shop.findById(req.params.id).lean()
        next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createShop = async function(req, res, next) {
    try {
        const created = req.body
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase()
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase()
        const shop = await new Shop(created).save()
        next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteShop = async function(req, res, next) {
    try {
      await Shop.deleteOne({_id: req.params.id})
      next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateShop = async function(req, res, next) {
    try {
      const updated = req.body
      if (!updated.path) updated.path = cyrillicToTranslit().transform(updated.name, "-").toLowerCase()
      else updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase()
      const shop = await Shop.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
      next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getGroups = async function(req, res, next) {
    try {
      const groups = await Product.distinct("group", {shop: req.params.shop, group: {$ne: ""}})
      next(req, res, groups)
    } catch (e) {
        errorHandler(res, e)
    }
}
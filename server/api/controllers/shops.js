const Shop = require('../models/shops')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
const mongoose = require('mongoose')
const translit = require('../utils/translit')


module.exports.getShops = async function(req, res, next) {
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

        const shops = await Shop.find(filter, fields).sort({name: 1}).lean()
        next(req, res, shops)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getShopById = async function(req, res, next) {
    try {
        const filter = {}
        if (req.params.id && mongoose.isValidObjectId(req.params.id)) {
            filter._id = mongoose.Types.ObjectId(req.params.id)
        } else if (req.params.id) {
            filter.path =  req.params.id
        }
        const shop = await Shop.findOne(filter, {"groups.products": 0}).lean()
        next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createShop = async function(req, res, next) {
    try {
        const created = req.body
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const shop = await new Shop(created).save()
        next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateShop = async function(req, res, next) {
    try {
      
      
      await req.body.groups.forEach(async(item) => {
        
        if (!item.path) item.path = translit(item.name)
        else item.path = translit(item.path)
        const updated = {}
        if (item._id) {
            for (let key in item) {
                updated[`groups.$.${key}`] = item[key]
            }
            await Shop.findOneAndUpdate({"groups._id": item._id}, {"$set": updated}, {new: true}).lean()
        } else {
            item._id = mongoose.Types.ObjectId(item._id)
            await Shop.findOneAndUpdate({_id: req.params.id}, {"$push": {"groups": item}}, {new: true}).lean()
        }
      })

      const finaly = {}
      const updated = {...req.body}


      if (!updated.path) updated.path = translit(updated.name)
      else updated.path = translit(updated.path)
      
      delete updated.groups
      finaly['$set'] = updated

      const shop = await Shop.findOneAndUpdate({_id: req.params.id}, finaly, {new: true}).lean()
      next(req, res, shop)
    } catch (e) {
        errorHandler(res, e)
    } 
}

const Partner = require('../models/partners')
const errorHandler = require('../utils/errorHandler')

module.exports.getPartners = async function(req, res, next) {
    try {
        const partners = await Partner.find().sort({name: 1}).lean()
        next(req, res, partners)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getPartnerById = async function(req, res, next) {
    try {
        const partner = await Partner.findById(req.params.id).lean()
        next(req, res, partner)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createPartner = async function(req, res, next) {
    try {
        const created = req.body
        const partner = await new Partner(created).save()
        next(req, res, partner)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deletePartner = async function(req, res, next) {
    try {
        await Partner.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updatePartner = async function(req, res, next) {
    try {
        const updated = req.body
        const partner = await Partner.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, partner)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesPartner = async function(req, res, next) {
    try {
        console.log(req.file)
        const updated = {}
        if (req.file) updated.image = 'https://centervnl.ru/uploads/' + req.files.image[0].filename
        const partner = await Partner.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, partner)
    } catch (e) {
        errorHandler(res, e)
    }
}

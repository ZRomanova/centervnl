const Data = require('../models/data')
const errorHandler = require('../utils/errorHandler')

module.exports.getByType = async function(req, res, next) {
    try {
        const info = await Data.findOne({type: req.params.type}, {data: 1, _id: 0}).lean()
        next(req, res, info.data)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateByType = async function(req, res, next) {
    try {
        const data = await Data.findOneAndUpdate({_id: req.params.type}, req.body, {new: true}).lean()
        next(req, res, data)
    } catch (e) {
        errorHandler(res, e)
    }
}


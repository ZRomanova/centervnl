const Pay = require('../models/donations')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function(req, res, next) {
    try {
        await new Pay({
          type: req.params.type,
          data: req.body
        }).save()

        res.status(200).json({"code":0})
    } catch (e) {
        errorHandler(res, e)
    }
}
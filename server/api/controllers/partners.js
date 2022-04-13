const Partners = require('../../models/partners')
const errorHandler = require('../utils/errorHandler')

module.exports.getPartners = async function(req, res, next) {
    try {
        const partners = await Partners.find().lean()
        next(req, res, partners)
    } catch (e) {
        errorHandler(res, e)
    }
}
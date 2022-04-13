const Data = require('../../models/data')
const errorHandler = require('../utils/errorHandler')


module.exports.getHomeText = async function(req, res, next) {
    try {
        const home = await Data.findOne({type: "HOME"}, {data: 1, _id: 0}).lean()
        next(req, res, home.data)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getContacts = async function(req, res, next) {
    try {
        const contacts = await Data.findOne({type: "CONTACTS"}, {data: 1, _id: 0}).lean()
        next(req, res, contacts.data)
    } catch (e) {
        errorHandler(res, e)
    }
}


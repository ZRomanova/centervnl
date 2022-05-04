const User = require('../models/users')
const errorHandler = require('../utils/errorHandler')

module.exports.getUsers = async function(req, res, next) {
  try {
      const users = await User.find().skip(+req.params.offset).limit(+req.params.limit).lean()
      next(req, res, users)
  } catch (e) {
      errorHandler(res, e)
  }
}

module.exports.getUserById = async function(req, res, next) {
  try {
      const user = await User.findById(req.params.id).lean()
      next(req, res, user)
  } catch (e) {
      errorHandler(res, e)
  }
}

module.exports.updateUser = async function(req, res, next) {
  try {
      const updated = req.body
      const user = await User.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
      next(req, res, user)
  } catch (e) {
      errorHandler(res, e)
  }
}

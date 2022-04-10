const passport = require('passport');
const User = require('../../models/users')
const errorHandler = require('../utils/errorHandler')
const { genPassword } = require('../../middleware/password')

const getRandomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

module.exports.register = async function(req, res, next) {
  try {
    // login password
      const candidate = await User.findOne({email: req.body.email})
  
      if (candidate) {
        // Пользователь существует, нужно отправить ошибку
        res.status(409).json({
          message: 'Такой email уже занят. Попробуйте войти.'
        })
      } else {
        // Нужно создать пользователя
        const create = req.body
        create.photo = req.file ? req.file.filename : `/images/avatars/user-${req.body.sex}-${getRandomNumber(1, 10)}.svg`
        create.password = genPassword(req.body.password)

        const user = await new User(create).save()
        next(req, res, user)
      }
    } catch(e) {
      errorHandler(res, e)
    }
};

module.exports.update = async function(req, res) {
  try {
    const updated = req.body
    updated.password = genPassword(req.body.password)
    const user = await User.findOneAndUpdate({_id: req.user.id}, {$set: updated}, {new: true}).lean()
    next(req, res, user)
  } catch (e) {
    errorHandler(res, e)
  }
};
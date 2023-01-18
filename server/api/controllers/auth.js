const request = require('request');
const User = require('../models/users')
const Form = require('../models/forms')
const Product = require('../models/products')
const Service = require('../models/services')
const Post = require('../models/posts')
const errorHandler = require('../utils/errorHandler')
const { genPassword, validPassword } = require('../../middleware/password');
const randomNumber = require('../utils/randomNumber');
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const cyrillicToTranslit = require('cyrillic-to-translit-js')

module.exports.register = async function(req, res, next) {
  try {
    // login password
      const candidate = await User.findOne({email: req.body.email}).lean()
  
      if (candidate) {
        // Пользователь существует, нужно отправить ошибку
        res.status(409).json({
          message: 'Такой email уже занят. Попробуйте войти.'
        })
      } else {
        // Нужно создать пользователя
        const create = {...req.body}
        if (!create.photo) create.photo = `https://centervnl.ru/images/avatars/user-${req.body.sex}-${randomNumber(1, 10)}.svg`
        create.password = genPassword(req.body.password)
        create.email = create.email.toLowerCase()
        if (create.patronymic) create.patronymic = cyrillicToTranslit().reverse(create.patronymic[0].toUpperCase() + create.patronymic.slice(1).toLowerCase())
        create.name = cyrillicToTranslit().reverse(create.name[0].toUpperCase() + create.name.slice(1).toLowerCase())
        create.surname = cyrillicToTranslit().reverse(create.surname[0].toUpperCase() + create.surname.slice(1).toLowerCase())
        const user = await new User(create).save()
        next(req, res, user)
      }
    } catch(e) {
      errorHandler(res, e)
    }
};

module.exports.update = async function(req, res, next) {
  try {
    const updated = {...req.body}
    updated.password = genPassword(req.body.password)
    updated.email = updated.email.toLowerCase()
    if (updated.patronymic) cyrillicToTranslit().reverse(updated.patronymic = updated.patronymic[0].toUpperCase() + updated.patronymic.slice(1).toLowerCase())
    updated.name = cyrillicToTranslit().reverse(updated.name[0].toUpperCase() + updated.name.slice(1).toLowerCase())
    updated.surname = cyrillicToTranslit().reverse(updated.surname[0].toUpperCase() + updated.surname.slice(1).toLowerCase())
    const user = await User.findOneAndUpdate({_id: req.user.id}, {$set: updated}, {new: true}).lean()
    next(req, res, user)
  } catch (e) {
    errorHandler(res, e)
  }
};

module.exports.registerEmo = async function(req, res, next) {
  const registr = this.register
  try {
    request.post('https://emo.su/api/login/get-user', {
      json: {login: req.body.loginEmo, password: req.body.passwordEmo},
    }, function (error, response, body) {
      if (!error) {
        const candidate = {...body, ...req.body};
        registr({...req, body: candidate}, res, next)
      } else {
        res.status(response.statusCode).json({message: response.statusMessage | body.message})
      }
    })
  } catch(e) {
    errorHandler(res, e)
  }
};

module.exports.login = async (req, res) => {
  try {
    const candidate = await User.findOne({email: req.body.email.toLowerCase()}, {email: 1, password: 1, isAdmin: 1}).lean()

    if (candidate) {
      // Проверка пароля, пользователь существует
      const passwordResult = validPassword(candidate.password, req.body.password)

      if (passwordResult) {
        // Генерация токена, пароли совпали
        const token = jwt.sign({
          userId: candidate._id,
          isAdmin: candidate.isAdmin
        }, keys.jwt, {expiresIn: 60 * 60 * 24})

        res.status(200).json({
          token: `Bearer ${token}`
        })
      } else {
        // Пароли не совпали
        res.status(401).json({
          message: 'Пароли не совпадают. Попробуйте снова.'
        })
      }
    } else {
      // Пользователя нет, ошибка
      res.status(404).json({
        message: 'Пользователь не найден.'
      })
    }
  } catch(e) {
    errorHandler(res, e)
  }
  
}

module.exports.profile = async function(req, res, next) {
  try {
    const posts = await Post.find({likes: req.user._id}, {name: 1, description: 1, date: 1, path: 1, image: 1}).lean()
    const services = await Service.find({likes: req.user._id}, {name: 1, description: 1, date: 1, path: 1, image: 1}).lean()
    const products = await Product.find({likes: req.user._id}, {name: 1, description: 1, date: 1, path: 1, image: 1}).lean()
    const projects = await Project.find({likes: req.user._id}, {name: 1, description: 1, date: 1, path: 1, image: 1}).lean()

    next(req, res, {likes: {posts, services, products, projects}})
  } catch (e) {
    errorHandler(res, e)
  }
};



module.exports.fillForm = async function(req) {
  try {
    const data = {
      page: req.headers.referer,
      answers: []
    }
    for (const str in req.body) {
      if (str.length > 2 && str.substring(0, 2) === "q_") {
        let item = str.slice(2)
        let element = data.answers.find(el => el.code == item)
        if (!element) {
          data.answers.push({
            code: item,
            question: req.body[str],
            answer: req.body[item]
          })
        }
      }
  }
    await new Form(data).save()
  } catch (e) {
    errorHandler(res, e)
  }
};
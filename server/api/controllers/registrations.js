const Service = require('../models/services')
const Registration = require('../models/registrations')
const mongoose = require('mongoose')
const moment = require('moment')
const { sendEmail } = require('../utils/email')
const errorHandler = require('../utils/errorHandler')
moment.locale('ru')

module.exports.getByService = async function(req, res, next) {
    try {

        const regs = await Registration.aggregate([
            { $match: {date: new Date(req.params.date), service: mongoose.Types.ObjectId(req.params.service)} }, //
            { $sort: {created: -1}},
            { $skip:  +req.query.offset},
            { $limit:  +req.query.limit},
            { $lookup:
                {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
        ])
        for (const reg of regs) {
            if (reg.user && reg.user.length) {
                const user = reg.user[0]
                reg.name = reg.name || user.name
                reg.surname = reg.surname || user.surname
                reg.patronymic = reg.patronymic || user.patronymic
                reg.email = reg.email || user.email
            }
        }

        next(req, res, regs)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getGroups = async function(req, res, next) {
    try {
      const groups = await Registration.distinct("date", {service: req.params.service})
      next(req, res, groups)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByUser = async function(req, res, next) {
  try {
      const now = moment().format()
      const regsActive = await Registration
      .find({session: req.session._id, date: {$gt: new Date(now)}})
      .sort({date: 1})
      .lean()

      const regsInactive = await Registration
      .find({session: req.session._id, date: {$lte: Date(now)}})
      .sort({date: -1})
      .lean()

      for (const item of regsActive) {
          const service = await Service.findById(item.service, 'name address _id peopleLimit').lean()
          item.service = service ? service : null
          if (item.status == 'отмена' || service) item.count = await Registration.countDocuments({date: item.date, service: service._id, status: {$nin: ['отмена', 'ведущий']}})
          item.date = moment(item.date).format('lll')
      }
      for (const item of regsInactive) {
        item.date = moment(item.date).format('lll')
        const service = await Service.findById(item.service, 'name address').lean()
        item.service = service ? service : null
      }

      next(req, res, {regsActive, regsInactive})
  } catch (e) {
      errorHandler(res, e)
  }
}

module.exports.create = async function(req, res, next) {
  try {
    const created = req.body

    created.date = moment(req.body.date)?.toDate();
    created.date_string = moment(req.body.date).format('D MMMM HH:mm')

    Object.keys(created).forEach(key => {
        created[key] = String(created[key]).replace(/,$/, '')
    })

    let isExists = await Registration.findOne({
        name: created.name, 
        surname: created.surname, 
        patronymic: created.patronymic,
        email: created.email,
        tel: created.tel,
        service: created.service,
        date_string: created.date_string
    })

    // console.log(created)

    if (!isExists) {
        // throw new Error('Ошибка. Вы уже зарегистрированы на данное мероприятие')
        await new Registration(created).save()

        const event = await Service.findOne({_id: created.service}).lean()

        if (event) {

            let message = `${created.name}, вы успешно зарегистрированы на "${event.name}"\n\n`
            message += `Мероприятие пройдёт ${moment(req.body.date).format('D MMMM в HH:mm')}.\n\n`
            if (event.address) message += `Место проведения: ${event.address}.\n\n`
            if (event.is_online) message += `Ссылка на подключение: ${event.url}\n\n`
            message += `Мы ждём вас!
            
Если ваши планы изменились, и вы не сможете участвовать, пожалуйста, сообщите нам по адресу centervnl@mail.ru`

            let messageToUser = {
                message, 
                to: created.email.trim(), 
                subject: 'Регистрация на мероприятие'
            }

            let sendToUser = await sendEmail(messageToUser)

            const messageToAdmin = {
                subject: 'Новая регистрация на мероприятие',
                message: `
    Мероприятие: ${event.name}   
    Дата: ${created.date_string}    

    Фамилия: ${created.surname}  
    Имя: ${created.name}  
    Отчество: ${created.patronymic}  
    Роль: ${created.roles}
    email: ${created.email}
    tel: ${created.tel}

    `
            }

            if (!sendToUser) {
                messageToAdmin.message += 'Пользователю не отправлено сообщение на почту'
            } else if (!sendToUser.accepted.includes(created.email)) {
                messageToAdmin.message += 'Пользователю указал недействительную почту, сообщение не доставлено'
            } else {
                messageToAdmin.message += 'Пользователю отправлено уведомление о регистрации'
            }

            await sendEmail(messageToAdmin)
        }
    }
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.createJson = async function(req, res) {
    try {
      const created = req.body
  
      created.date = moment(req.body.date)?.toDate();
      created.date_string = moment(req.body.date).format('D MMMM HH:mm')
  
      let isExists = await Registration.findOne({
        name: created.name, 
        surname: created.surname, 
        patronymic: created.patronymic,
        email: created.email,
        tel: created.tel,
        service: created.service,
        date_string: created.date_string
      })
  
      if (!isExists) {
        let checkout = await new Registration(created).save()
        res.status(201).json(checkout)
      } else {
        res.status(403).json({message: 'Такая запись уже существует'})
      }
      
    } catch (e) {
      errorHandler(res, e)
    }
  }

module.exports.update = async function(req, res, next) {
    try {
        const updated = req.body

        const service = await Registration.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res, next) {
    try {
        const orders = await Registration.aggregate([
            {
                $match: {_id: mongoose.Types.ObjectId(req.params.id)}
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup:
                {
                    from: 'services',
                    localField: 'service',
                    foreignField: '_id',
                    as: 'service'
                }
            }
        ])

        if (orders.length){
            const order = orders[0]

            if (order.user && order.user.length) {
                const user = order.user[0]
                order.name = order.name || user.name
                order.surname = order.surname || user.surname
                order.patronymic = order.patronymic || user.patronymic
                order.email = order.email || user.email
            }
            
            if (order.service.length) order.service = order.service[0]
            next(req, res, order)
        }
        else 
            next(req, res, new Error("Запись не найдена"))
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.check = async function(user, date, service) {
  try {
    //   const reg = user ? await Registration.findOne({user: user._id, date, service: service._id}, {_id: 0}).lean() : false
      const regLen = await Registration.countDocuments({date, service: service._id, status: {$nin: ['отмена', 'ведущий']}})
      return {count: regLen}
    //   return {isReg: reg ? true : false, count: regLen}
  } catch (e) {
      console.log(e)
  }
}

module.exports.toggleStatus = async function(req, res, next) {
    try {
        await Registration.updateOne({_id: req.params.id}, {$set: {status: req.params.status}}, {new: true})

        next(req, res, {message: "Обновлено."})
    } catch (e) {
        errorHandler(res, e)
    }
}

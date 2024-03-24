const Form = require('../models/forms')
const errorHandler = require('../utils/errorHandler')
const { sendEmail } = require('../utils/email')

module.exports.fillForm = async function (req, res) {
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
            answer: String(req.body[item])
          })
        }
      }
    }

    if (data && data.answers && data.answers.length) {
      await new Form(data).save()
      let message = `Форма заполнена на странице ${data.page}\n\n`
      data.answers.forEach(item => {
        message += `${item.question} — ${item.answer}\n`
      })
      await sendEmail({ message, subject: 'Новая форма на сайте centervnl.ru' })
    }
  } catch (e) {
    errorHandler(res, e)
  }
};


module.exports.getFormById = async function (req, res, next) {
  try {
    const form = await Form.findById(req.params.id).lean()
    next(req, res, form)
  } catch (e) {
    errorHandler(res, e)
  }
};


module.exports.getForms = async function (req, res, next) {
  try {
    const docs = await Form
      .find()
      .skip(+req.query.offset)
      .limit(+req.query.limit)
      .sort({ created: -1 }).lean()

    next(req, res, docs)
  } catch (e) {
    errorHandler(res, e)
  }
};
const Form = require('../models/forms')


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


module.exports.getFormById = async function(req, res, next) {
  try {
    const form = await Form.findById(req.params.id).lean()
    next(req, res, form)
  } catch (e) {
    errorHandler(res, e)
  }
};


module.exports.getForms = async function(req, res, next) {
  try {
    const docs = await Form
    .find()
    .skip(+req.query.offset)
    .limit(+req.query.limit)
    .sort({created: -1}).lean()
    
    next(req, res, docs)
  } catch (e) {
    errorHandler(res, e)
  }
};
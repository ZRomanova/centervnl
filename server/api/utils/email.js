const nodemailer = require('nodemailer');
const keys = require('../../config/keys')

const defaultEmailTo = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'romanova.zoya.2002@mail.ru' : 'centervnl@mail.ru'

let transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: keys.emailUser,
        pass: keys.emailPassword,
    },
});

module.exports.sendEmail = async (data = {}) => {
  try {
    await transporter.sendMail({
      from: `"${data.from || 'no-reply@centervnl.ru'}" <no-reply@centervnl.ru>`,
      to: data.to || defaultEmailTo,
      subject: data.subject || 'Сообщение от сайта centervnl.ru',
      text: data.message,
    });
  } catch (e) {
    return
  }
}

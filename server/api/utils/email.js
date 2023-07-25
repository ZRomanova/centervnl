const nodemailer = require('nodemailer');
const keys = require('../../config/keys')

let transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: keys.emailUser,
        pass: keys.emailPassword,
    },
});

module.exports = async (message, subject) => await transporter.sendMail({
  from: '"no-replay" <no-replay@centervnl.ru>',
  to: 'centervnl@mail.ru',
  subject: subject || 'Новая форма на сайте centervnl',
  text: message,
});
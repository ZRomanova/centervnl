const multer = require('multer')
const moment = require('moment')
const cyrillicToTranslit = require('cyrillic-to-translit-js')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const storage = multer.diskStorage({
  destination(req, file,  cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${moment().format('DDMMYYYY-HHmmss_SSS')}-${getRandomInt(1, 10000)}-${getRandomInt(1, 10000)}-${cyrillicToTranslit().transform(file.originalname, "_")}`)
  }
})

const limits = {
  fileSize: 1024 * 1024 * 500
}

module.exports = multer({storage, limits})
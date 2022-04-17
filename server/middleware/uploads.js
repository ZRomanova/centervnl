const multer = require('multer')
const moment = require('moment')
const express = require('express')
const path = require('path');
const cyrillicToTranslit = require('cyrillic-to-translit-js')

function getRandomInt(min, max) {
  return String(Math.floor(Math.random() * (max - min)) + min);
}

console.log(__dirname
  )
const storage = multer.diskStorage({
  destination(req, file,  cb) {
    cb(null, path.resolve(
      `home/web/www/centervnl/uploads`, 'uploads/'
    ));
  },
  filename(req, file, cb) {
    cb(null, `${moment().format('DDMMYYYY_HHmmss_SSS')}_${getRandomInt(1, 10000)}_${cyrillicToTranslit().transform(file.originalname, "_")}`)
  }
})

const limits = {
  fileSize: 1024 * 1024 * 500
}

module.exports = multer({storage, limits})
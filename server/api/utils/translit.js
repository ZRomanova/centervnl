const cyrillicToTranslit = require('cyrillic-to-translit-js')

module.exports = (text) => {
  return cyrillicToTranslit().transform(text, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
}
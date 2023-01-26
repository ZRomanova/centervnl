const cyrillicToTranslit = require('cyrillic-to-translit-js')


module.exports = (text) => {
  text = text.toLowerCase()
  text = text.trim()
  text = cyrillicToTranslit().transform(text, "-")
  text = text.replace(/[^a-z0-9-]/gi,'')
  text = text.replace(/[-]+/gi,'-')
  text = text.replace(/^[-]/gi,'')
  text = text.replace(/[-]$/gi,'')
  return text
}
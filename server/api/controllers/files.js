const path = require('path');
const fs = require('fs');

const Gallery = require('../models/gallery')
const errorHandler = require('../utils/errorHandler')
const GALLERY_TYPES = ['jpeg', 'jpg', 'png']

module.exports.getFilesServer = async function(req, res) {
  try {
    let dir = path.join(
      __dirname, '..', '..', '..', './uploads/'
    )
    function* traverseDir(dirPath) {
      const dirEntries = fs.readdirSync(dirPath, {withFileTypes: true});
    
      // Сортируем сущности для обеспечения большей предсказуемости
      dirEntries.sort(
        (a, b) => a.name.localeCompare(b.name, "en")
      );
    
      for (const dirEntry of dirEntries) {
        const fileName = dirEntry.name;
        const pathName = path.join(dirPath, fileName);
        if (dirEntry.isDirectory()) {
          yield* traverseDir(pathName);
        } else {
          yield 'https://centervnl.ru/uploads/' + fileName;
        }
      }
    }
    let files = []
    for (const filePath of traverseDir(dir)) {
      let type_arr = filePath.split('.')
      let type = type_arr[type_arr.length - 1]
      files.push({
        url: filePath,
        gallery: !GALLERY_TYPES.includes(type.toLocaleLowerCase()) ? null : !!await Gallery.findOne({path: filePath}, {_id: 1}).lean()
      });
    }
    res.status(200).json(files)
  } catch (e) {
    console.log(e)
    errorHandler(res, e)
  }
}

module.exports.getFilesGallery = async function(req, res) {
  try {
    let files = await Gallery.find().lean()
    res.status(200).json(files)
  } catch (e) {
      errorHandler(res, e)
  }
}

module.exports.createFileGalley = async function(req, res) {
  try {
    const created = req.body
    const file = await new Gallery(created).save()
    res.status(201).json(file)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.updateFileGalley = async function(req, res) {
  try {
    const updated = req.body
    const file = await Gallery.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true})
    res.status(201).json(file)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.uploadFileServer = async function(req, res) {
  try {
    const uploads = []
    if (req.files) {
      for (let file of req.files) {
        let type_arr = file.filename.split('.')
        let type = type_arr[type_arr.length - 1]
        uploads.push({
          url: 'https://centervnl.ru/uploads/' + file.filename,
          gallery: !GALLERY_TYPES.includes(type.toLocaleLowerCase()) ? null : !!await Gallery.findOne({path: filePath}, {_id: 1}).lean()
        })
      }
    }
    res.status(201).json(uploads)

  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.deleteFileServer = async function(req, res) {
    try {
      await Gallery.deleteOne({path: req.query.id})

      let filepath = req.query.id.split('https://centervnl.ru/uploads/')[1]
      fs.unlink(path.join(__dirname, '..', '..', '..', './uploads/') + filepath, (err) => {
        if (err) console.log(err);
      });
      res.status(200).json({message: 'Удалено'})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteFileGallery = async function(req, res) {
  try {
    await Gallery.deleteOne({path: req.query.id})
    res.status(200).json({message: 'Удалено'})
  } catch (e) {
    console.log(e)
      errorHandler(res, e)
  }
}

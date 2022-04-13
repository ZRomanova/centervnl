const express = require('express');
const router = express.Router();
const controller = require('../controllers/services');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

fields = [
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 20 }
]

router.put('/:id', auth.isAdmin, controller.updateService, responseJson)
router.patch('/:id', auth.isAdmin, upload.fields(fields), controller.uploadImagesService, responseJson)
router.get('/', controller.getServices, responseJson)
router.get('/active', controller.getAnouncements, responseJson)
router.get('/:id', controller.getServiceById, responseJson)
router.post('/', auth.isAdmin, controller.createService, responseJson)

module.exports = router;
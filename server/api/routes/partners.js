const express = require('express');
const router = express.Router();
const controller = require('../controllers/partners');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

router.put('/:id', auth.isAdmin, controller.updatePartner, responseJson)
router.post('/', auth.isAdmin, controller.createPartner, responseJson)
router.patch('/:id', auth.isAdmin, upload.single('image'), controller.uploadImagesPartner, responseJson)
router.get('/', controller.getPartners, responseJson)

module.exports = router;
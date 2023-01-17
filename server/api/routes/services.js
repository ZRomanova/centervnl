const express = require('express');
const router = express.Router();
const controller = require('../controllers/services');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')
const passport = require('passport')

fields = [
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 20 }
]

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateService(req, res, responseJson))
router.patch('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.fields(fields), (req, res) => controller.uploadImagesService(req, res, responseJson))
router.get('/', (req, res) => controller.getServices(req, res, responseJson))
router.get('/day/:day', (req, res) => controller.getAnouncementsByDay(req, res, responseJson))
router.get('/month/:month', (req, res) => controller.getAnouncementsByMonth(req, res, responseJson))
router.get('/:id', (req, res) => controller.getServiceById(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createService(req, res, responseJson))
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => controller.deleteService(req, res, responseJson))

module.exports = router;
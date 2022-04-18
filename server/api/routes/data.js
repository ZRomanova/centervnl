const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/data');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

router.put('/:type', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.single('image'), (req, res) => controller.updateByType(req, res, responseJson))
router.post('/gallery', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.single('image'), (req, res) => controller.addToGallery(req, res, responseJson))
router.patch('/gallery/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.single('image'), (req, res) => controller.updateInGallery(req, res, responseJson))
router.delete('/gallery/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.removeFormGallery(req, res, responseJson))
router.get('/:type', (req, res) => controller.getByType(req, res, responseJson))


module.exports = router;
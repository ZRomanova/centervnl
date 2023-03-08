const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/files');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

router.put('/gallery/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, controller.updateFileGalley)

router.post('/gallery', passport.authenticate('jwt', {session: false}), auth.isAdmin, controller.createFileGalley)
router.post('/server', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.array('files'), controller.uploadFileServer)

router.get('/gallery', controller.getFilesGallery)
router.get('/server', passport.authenticate('jwt', {session: false}), auth.isAdmin, controller.getFilesServer)

router.delete('/gallery', passport.authenticate('jwt', {session: false}), auth.isAdmin, controller.deleteFileGallery)
router.delete('/server', passport.authenticate('jwt', {session: false}), auth.isAdmin, controller.deleteFileServer)

module.exports = router;
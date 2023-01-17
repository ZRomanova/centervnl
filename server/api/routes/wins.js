const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/wins');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateWin(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createWin(req, res, responseJson))
router.patch('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.single('image'), (req, res) => controller.uploadImagesWins(req, res, responseJson))
router.get('/', (req, res) => controller.getWins(req, res, responseJson))
router.get('/:id', (req, res) => controller.getWinById(req, res, responseJson))
// router.delete('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.deleteDocument(req, res, responseJson))

module.exports = router;
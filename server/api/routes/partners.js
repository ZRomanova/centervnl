const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/partners');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updatePartner(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createPartner(req, res, responseJson))
router.patch('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.single('image'), (req, res) => controller.uploadImagesPartner(req, res, responseJson))
router.get('/', (req, res) => controller.getPartners(req, res, responseJson))
router.get('/:id', (req, res) => controller.getPartnerById(req, res, responseJson))
router.delete('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.deletePartner(req, res, responseJson))

module.exports = router;
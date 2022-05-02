const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/orders');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')

// router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.update(req, res, responseJson))
router.get('/:id', auth.isAdmin, (req, res) => controller.getById(req, res, responseJson))
router.post('/', auth.isAuth, (req, res) => controller.addToBin(req, res, responseJson))
router.patch('/product/:id', auth.isAuth, (req, res) => controller.updateBin(req, res, responseJson))

module.exports = router;
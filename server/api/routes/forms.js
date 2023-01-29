const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/forms');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')

router.get('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.getForms(req, res, responseJson))
router.get('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.getFormById(req, res, responseJson))

module.exports = router;
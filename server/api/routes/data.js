const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/data');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')

router.put('/:type', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateByType(req, res, responseJson))
router.get('/:type', (req, res) => controller.getByType(req, res, responseJson))

module.exports = router;
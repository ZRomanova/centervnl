const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/users');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateUser(req, res, responseJson))
router.get('/', (req, res) => controller.getUsers(req, res, responseJson))
router.get('/:id', (req, res) => controller.getUserById(req, res, responseJson))

module.exports = router;
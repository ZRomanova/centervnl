const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const responseJson = require('../utils/responseJson');

router.post('/registration', controller.register, responseJson)
router.post('/login', (req, res) => controller.login(req, res, responseJson))

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const responseJson = require('../utils/responseJson');

router.post('/registration', controller.register, responseJson)

module.exports = router;
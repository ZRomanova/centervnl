const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth')
const uploads = require('../../middleware/uploads')

router.post('/registration', controller.register)

module.exports = router;
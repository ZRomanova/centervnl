const express = require('express');
const router = express.Router();
const controller = require('../controllers/pay');


router.post('/:type', controller.create)

module.exports = router;
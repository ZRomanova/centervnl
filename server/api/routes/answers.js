const express = require('express');
const router = express.Router();
const controller = require('../controllers/answers');

router.post('/', controller.getAnswer)


module.exports = router;
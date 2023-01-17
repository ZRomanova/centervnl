const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')

const controller = require('../controllers/wins');

router.get('/', controller.getWinsList)
router.get('/:path', controller.getWinPage) 

module.exports = router;
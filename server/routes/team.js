const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')

const controller = require('../controllers/team');

router.get('/', controller.getTeamList)
router.get('/:path', controller.getTeamPage) 

module.exports = router;
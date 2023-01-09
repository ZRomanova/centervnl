const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')

const controller = require('../controllers/programs');

router.get('/', controller.getProgramsList) 
router.get('/:path', controller.getProgramsPage) 

module.exports = router;
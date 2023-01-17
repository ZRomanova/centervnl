const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')

const controller = require('../controllers/projects');

router.get('/', controller.getGrantListPage) 
router.get('/:path', controller.getGrantPage) 

module.exports = router;
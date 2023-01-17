const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')
const controller = require('../controllers/library');

router.get('/', controller.getLibsListPage) 
router.get('/:path', controller.getLibPage) 

module.exports = router;
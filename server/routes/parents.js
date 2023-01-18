const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')
const controller = require('../controllers/parents');

router.get('/', controller.getParentsList) 
router.get('/club', controller.getParentsClub) 
router.get('/:path', controller.getParentsPage) 

module.exports = router;
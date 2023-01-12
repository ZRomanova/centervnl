const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')
const controller = require('../controllers/parents');

router.get('/', controller.getParentsList) 
// router.get('/:path', controller.getNewsPage) 
// router.post('/:id/like', isAuth, controller.toggleLike)

module.exports = router;
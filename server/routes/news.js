const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')
const controller = require('../controllers/news');

router.get('/', controller.getNewsListPage) 
router.get('/:path', controller.getNewsPage) 
// router.post('/:id/like', isAuth, controller.toggleLike)

module.exports = router;
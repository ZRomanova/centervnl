const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')
const controller = require('../controllers/help');

router.get('/', controller.getHelpList) 
router.get('/donate', controller.getHelpDonate) 
// router.get('/:path', controller.getNewsPage) 
// router.post('/:id/like', isAuth, controller.toggleLike)

module.exports = router;
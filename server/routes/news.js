const express = require('express');
const router = express.Router();

const controller = require('../controllers/news');

router.get('/', controller.getNewsListPage) 
router.get('/:path', controller.getNewsPage) 
router.post('/:id/like', controller.toggleLike)


module.exports = router;
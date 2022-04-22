const express = require('express');
const router = express.Router();
const controller = require('../controllers/shop');

router.get('/:id', controller.getProductPage)
router.post('/:id/like', controller.toggleLike)

module.exports = router;
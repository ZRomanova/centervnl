const express = require('express');
const router = express.Router();
const controller = require('../controllers/shop');
const {isAuth} = require('../middleware/auth')

router.get('/:id', controller.getProductPage)
router.post('/:id/like', isAuth, controller.toggleLike)

module.exports = router;
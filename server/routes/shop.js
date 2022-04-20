const express = require('express');
const router = express.Router();
const controller = require('../controllers/shop');

router.get('/', controller.redirectToShop) 
router.get('/:shop', controller.getShopPage) 
router.get('/product/:product', controller.getProductPage)

module.exports = router;
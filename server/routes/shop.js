const express = require('express');
const router = express.Router();
const controller = require('../controllers/shop');

router.get('/', controller.getShopPage) 
router.get('/:id', controller.getCatalogsList) 

module.exports = router;
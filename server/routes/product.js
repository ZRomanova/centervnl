const express = require('express');
const router = express.Router();
const controller = require('../controllers/shop');

router.get('/:id', controller.getProductPage)

module.exports = router;
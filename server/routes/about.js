const express = require('express');
const router = express.Router();

const controller = require('../controllers/about');

router.get('/', controller.getAboutList) 
router.get('/list', controller.getAboutPage) 

module.exports = router;
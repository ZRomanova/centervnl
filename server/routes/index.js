const express = require('express');
const router = express.Router();

const ctrlIndex = require('../controllers/index');

/* GET home page. */
router.get('/', ctrlIndex.getHomePage) 

module.exports = router;

const express = require('express');
const router = express.Router();

const controller = require('../controllers/news');

router.get('/', controller.getNewsListPage) 


module.exports = router;
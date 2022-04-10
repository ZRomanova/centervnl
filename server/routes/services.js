const express = require('express');
const router = express.Router();

const controller = require('../controllers/services');

router.get('/', controller.getServicesListPage) 

module.exports = router;
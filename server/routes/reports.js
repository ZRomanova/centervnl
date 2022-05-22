const express = require('express');
const router = express.Router();

const controller = require('../controllers/reports');

router.get('/', controller.getReportsListPage) 
router.get('/:year', controller.getReportPage) 

module.exports = router;
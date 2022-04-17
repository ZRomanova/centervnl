const express = require('express');
const router = express.Router();

const controller = require('../controllers/projects');

router.get('/', controller.getProjectListPage) 
router.get('/:path', controller.getProjectPage) 

module.exports = router;
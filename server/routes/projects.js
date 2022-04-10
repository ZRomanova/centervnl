const express = require('express');
const router = express.Router();

const controller = require('../controllers/projects');

router.get('/', controller.getProjectListPage) 

module.exports = router;
const express = require('express');
const router = express.Router();

const controller = require('../controllers/projects');

router.get('/', controller.getProjectListPage) 
router.get('/:path', controller.getProjectPage) 
router.post('/:id/like', controller.toggleLike)

module.exports = router;
const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')

const controller = require('../controllers/projects');

router.get('/', controller.getProjectListPage) 
router.get('/:path', controller.getProjectPage) 
router.post('/:id/like', isAuth, controller.toggleLike)

module.exports = router;
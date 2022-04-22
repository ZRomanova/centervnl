const express = require('express');
const router = express.Router();

const controller = require('../controllers/services');

router.get('/', controller.getServicesListPage) 
router.get('/:path', controller.getServicePage)
router.post('/:id/like', controller.toggleLike)

module.exports = router;
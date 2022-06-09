const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')

const controller = require('../controllers/services');

router.get('/good-college-summer', controller.dkTest)
router.post('/good-college-summer', controller.dkCheck)
router.get('/', controller.getServicesListPage) 
router.get('/:path', controller.getServicePage)
router.post('/:id/like', isAuth, controller.toggleLike)
router.post('/', isAuth, controller.createRegistration)


module.exports = router;
const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')

const controller = require('../controllers/index');


router.get('/checkout', isAuth, controller.getProfileCheckouts) 
router.get('/order', isAuth, controller.getCreateOrder)
router.get('/orders', isAuth, controller.getProfileOrders)
router.get('/checkout/:id/:status', isAuth, controller.changeStatusCheckouts)
router.get('/', isAuth, controller.getProfilePage)


module.exports = router;
const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')

const controller = require('../controllers/services');


router.get('/', controller.getServicesListPage) 
router.get('/finish', controller.getRegistrationFinish)
router.get('/error', controller.getRegistrationError)
router.get('/:path', controller.getServicePage)
router.post('/', controller.createRegistration)


module.exports = router;
const express = require('express');
const router = express.Router();

const controller = require('../controllers/index');

/* GET home page. */
router.get('/', controller.getHomePage) 
router.get('/docs', controller.getDocsPage)
router.get('/partners', controller.getPartnersPage)
router.get('/policy', controller.getPolicyPage)
router.post('/order/:id', controller.createOrder)
router.use('/profile', require('./profile')) 

// router.use('/shop', require('./shop'))
// router.use('/product', require('./product'))
router.use('/projects', require('./projects'))
router.use('/programs', require('./programs'))
router.use('/about', require('./about'))
router.use('/services', require('./services'))
router.use('/news', require('./news'))
// router.use('/reports', require('./reports'))
router.use('/team', require('./team'))

//auth
router.use('/auth', require('./auth'))

module.exports = router;

const express = require('express');
const router = express.Router();

const controller = require('../controllers/index');

/* GET home page. */
router.get('/', controller.getHomePage) 

router.get('/shop/', controller.getShopPage)
router.get('/projects/', controller.getProjectsPage)
router.get('/about/', controller.getAboutPage)
router.get('/services/', controller.getServicesPage)
router.get('/news/', controller.getNewsPage)

module.exports = router;

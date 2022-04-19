const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'))
router.use('/data', require('./data'))
router.use('/partners', require('./partners'))
router.use('/projects', require('./projects'))
router.use('/posts', require('./posts'))
router.use('/services', require('./services'))
router.use('/tags', require('./tags'))
router.use('/shops', require('./shops'))
router.use('/products', require('./products'))


module.exports = router;
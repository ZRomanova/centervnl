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
router.use('/registrations', require('./registrations'))
router.use('/orders', require('./orders'))
router.use('/team', require('./staffs'))
router.use('/users', require('./users'))
router.use('/reports', require('./reports'))
router.use('/documents', require('./docs'))
router.use('/programs', require('./programs'))
router.use('/press', require('./press'))
router.use('/wins', require('./wins'))
router.use('/library', require('./library'))
router.use('/parents', require('./parents'))
router.use('/pay', require('./pay'))
router.use('/forms', require('./forms'))
router.use('/files', require('./files'))
router.use('/providers', require('./provider'))
router.use('/question', require('./answers'))


module.exports = router;
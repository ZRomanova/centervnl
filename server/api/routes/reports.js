const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/reports');
const responseJson = require('../utils/responseJson');
const upload = require('../../middleware/uploads')
const auth = require('../../middleware/auth')

fields = [
  { name: 'finance', maxCount: 1 },
  { name: 'justice', maxCount: 1 },
  { name: 'annual', maxCount: 1 }
]

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateReport(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createReport(req, res, responseJson))
router.get('/', (req, res) => controller.getReports(req, res, responseJson))
router.get('/years', (req, res) => controller.getYears(req, res, responseJson))
router.get('/:id', (req, res) => controller.getReportById(req, res, responseJson))
router.patch('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.fields(fields), (req, res) => controller.uploadFilesReport(req, res, responseJson))

module.exports = router;
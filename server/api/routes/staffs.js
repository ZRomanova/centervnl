const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/staffs');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateStaff(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createStaff(req, res, responseJson))
router.post('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.addStaff(req, res, responseJson))
router.patch('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.single('image'), (req, res) => controller.uploadImagesStaff(req, res, responseJson))
router.get('/', (req, res) => controller.getStaffs(req, res, responseJson))
router.get('/positions', (req, res) => controller.getPositions(req, res, responseJson))
router.get('/:id', (req, res) => controller.getStaffById(req, res, responseJson))
router.delete('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.deleteStaff(req, res, responseJson))

module.exports = router;
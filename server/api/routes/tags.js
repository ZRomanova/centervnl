const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/tags');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateTag(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createTag(req, res, responseJson))
router.get('/', (req, res) => controller.getTags(req, res, responseJson))
router.get('/:id', (req, res) => controller.getTagById(req, res, responseJson))
router.delete('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.deleteTag(req, res, responseJson))

module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/provider_docs');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateDocument(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createDocument(req, res, responseJson))
router.patch('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.single('file'), (req, res) => controller.uploadFileDocument(req, res, responseJson))
router.get('/', (req, res) => controller.getDocuments(req, res, responseJson))
router.get('/:id', (req, res) => controller.getDocumentById(req, res, responseJson))
router.delete('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.deleteDocument(req, res, responseJson))

module.exports = router;
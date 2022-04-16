const express = require('express');
const router = express.Router();
const controller = require('../controllers/posts');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')
const passport = require('passport')

fields = [
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 20 }
]

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updatePost(req, res, responseJson))
router.patch('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, upload.fields(fields), (req, res) => controller.uploadImagesPost(req, res, responseJson))
router.get('/', (req, res) => controller.getPosts(req, res, responseJson))
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => controller.deletePost(req, res, responseJson))
router.get('/:id', (req, res) => controller.getPostById(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createPost(req, res, responseJson))

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/posts');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

fields = [
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 20 }
]

router.put('/:id', auth.isAdmin, controller.updatePost, responseJson)
router.patch('/:id', auth.isAdmin, upload.fields(fields), controller.uploadImagesPost, responseJson)
router.get('/', controller.getPosts, responseJson)
router.get('/:id', controller.getPostById, responseJson)
router.post('/', auth.isAdmin, controller.createPost, responseJson)

module.exports = router;
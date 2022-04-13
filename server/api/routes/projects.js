const express = require('express');
const router = express.Router();
const controller = require('../controllers/projects');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/uploads')

fields = [
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 20 }
]

router.put('/:id', auth.isAdmin, controller.updateProject, responseJson)
router.patch('/:id', auth.isAdmin, upload.fields(fields), controller.uploadImagesProject, responseJson)
router.get('/', controller.getProjects, responseJson)
router.get('/active', controller.getActive, responseJson)
router.get('/:id', controller.getProjectById, responseJson)
router.post('/', auth.isAdmin, controller.createProject, responseJson)

module.exports = router;
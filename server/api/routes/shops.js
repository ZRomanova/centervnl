const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/shops');
const responseJson = require('../utils/responseJson');
const auth = require('../../middleware/auth')

router.put('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.updateShop(req, res, responseJson))
router.post('/', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.createShop(req, res, responseJson))
router.get('/', (req, res) => controller.getShops(req, res, responseJson))
router.get('/:id', (req, res) => controller.getShopById(req, res, responseJson))
router.get('/products/:shop', (req, res) => controller.getProductsInShop(req, res, responseJson))
router.get('/groups/:shop', (req, res) => controller.getGroups(req, res, responseJson))
router.delete('/:id', passport.authenticate('jwt', {session: false}), auth.isAdmin, (req, res) => controller.deleteShop(req, res, responseJson))

module.exports = router;
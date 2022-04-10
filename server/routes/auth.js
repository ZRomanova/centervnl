const express = require('express');
const router = express.Router();
const passport = require('passport')

const controller = require('../controllers/auth');

router.post('/registration', controller.registr)
router.post('/registration-emo', controller.registrEmo)

router.post('/login', passport.authenticate('local', {
      failureRedirect: '/#authFail',
      failureFlash: true,
    }),
    function(req, res) {res.redirect('/')}
  )

module.exports = router;
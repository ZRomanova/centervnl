const express = require('express');
const router = express.Router();
const passport = require('passport');
const { login } = require('../api/controllers/auth');

const controller = require('../controllers/auth');

router.post('/registration', controller.registr)
router.post('/update', controller.update)
router.post('/registration-emo', controller.registrEmo)

router.post('/login', passport.authenticate('local', {
      failureRedirect: '/#authFail',
      failureFlash: true,
    }), (req, res) =>  {res.redirect('/')}
  )

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
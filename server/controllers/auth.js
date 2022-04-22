const api = require('../api/controllers/auth')
const passport = require('passport');

module.exports.registr = function(req, res) {
    api.register(req, res, passport.authenticate('local', {
        failureRedirect: '/#authFail',
        successRedirect: req.headers.referer,
        failureFlash: true,
    }));
}

module.exports.registrEmo = function(req, res) {
    api.registerEmo(req, res, passport.authenticate('local', {
        failureRedirect: '/#authFail',
        successRedirect: req.headers.referer,
        failureFlash: true,
    }));
}

module.exports.update = function(req, res) {
    api.update(req, res, res.redirect('/profile'));
}
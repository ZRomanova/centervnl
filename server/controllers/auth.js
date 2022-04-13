const api = require('../api/controllers/auth')

module.exports.registr = function(req, res) {
    api.register(req, res, res.redirect('/'));
}

module.exports.registrEmo = function(req, res) {
    api.registerEmo(req, res, res.redirect('/'));
}

module.exports.update = function(req, res) {
    api.update(req, res, res.redirect('/'));
}
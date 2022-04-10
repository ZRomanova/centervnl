const api = require('../api/controllers/auth')
const {getHomePage} = require('../controllers/index')

module.exports.registr = function(req, res) {
    api.register(req, res, function(req, res, data) {
        getHomePage(req, res, {user: data});
    });
}

module.exports.registrEmo = function(req, res) {
    api.register(req, res, function(req, res, responseData) {
        getHomePage(req, res, responseData);
    });
}
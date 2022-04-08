module.exports.getHomePage = function(req, res) {
    res.render('index', {title: 'Главная'})
}
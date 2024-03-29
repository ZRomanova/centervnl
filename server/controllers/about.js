const apiShops = require('../api/controllers/shops')
const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')

module.exports.getAboutList = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            // contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderAboutList(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderAboutList = function(req, res, data) {
    res.render('about-list', {
        title: 'О нас',
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session,
        shops: data.shops
    })
}

module.exports.getAboutPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            // contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderAboutPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderAboutPage = function(req, res, data) {
    res.render('about', {
        title: 'О нас',
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session,
        shops: data.shops
    })
}
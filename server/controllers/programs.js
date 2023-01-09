const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')

module.exports.getProgramsList = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.query.filter_visible = true
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        renderProgramsList(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderProgramsList = function(req, res, data) {
    res.render('programs-list', {
        title: 'О нас',
        programs: data.programs, 
        contacts: data.contacts,
        user: req.user,
        shops: data.shops
    })
}

module.exports.getProgramsPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.query.filter_visible = true
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        await apiPrograms.getProgramByPath(req, res, (req, res, program) => {
            result.program = program
        })

        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })

        renderProgramPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderProgramPage = function(req, res, data) {
    res.render('program', {
        title: data.program ? data.program.name : "Не найдено",
        programs: data.programs, 
        program: data.program, 
        contacts: data.contacts,
        user: req.user,
        shops: data.shops
    })
}
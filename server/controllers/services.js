const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')
const apiServices = require('../api/controllers/services')
const apiRegistrations = require('../api/controllers/registrations')
const apiShops = require('../api/controllers/shops')
const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const moment = require('moment')
moment.locale('ru')

module.exports.getServicesListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}

        req.query.filter_visible = true
        
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        req.params.type = "EVENTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.text = data.text
        })
        renderServicesListPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}


const renderServicesListPage = function(req, res, data) {
    res.render('services-list', {
        title: 'Мероприятия',
        contacts: data.contacts,
        programs: data.programs,
        text: data.text,
        session: req.session,
        shops: data.shops
    })
}

module.exports.getServicePage = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        await apiServices.getServiceByPath(req, res, (req, res, service) => {
            result.service = service 
        })

        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        renderServicePage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderServicePage = function(req, res, data) {
    res.render('service', {
        title: data.service ? data.service.name : 'Не найдено',
        service: data.service,
        user_date: req.query.date,
        session: req.session,
        posts: data.posts,
        contacts: data.contacts,
        programs: data.programs,
        shops: data.shops
    })
}

module.exports.createRegistration = async (req, res) => {
    try {
        await apiRegistrations.create(req, res, (req, res, reg) => {
            res.redirect("/services/finish")
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.getRegistrationFinish = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
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
        renderRegistrationFinish(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderRegistrationFinish  = function(req, res, data) {
    res.render('service-finish', {
        title: 'Вы зарегистрированы!',
        programs: data.programs, 
        contacts: data.contacts, 
        session: req.session,
        shops: data.shops
    })  
}
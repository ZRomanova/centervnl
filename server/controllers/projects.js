const apiProjects = require('../api/controllers/projects')
const apiShops = require('../api/controllers/shops')
const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const moment = require('moment')

moment.locale('ru')

module.exports.getGrantListPage = async function(req, res, data = {}) {
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
        req.query.filter_is_grant = true
        req.query.fields_period = 1
        await apiProjects.getProjects(req, res, async (req, res, projects) => {
            projects.forEach(project => {
                if (project.period.end) {
                    project.date = `${moment(project.period.start).format('DD.MM.yyyy')} - ${moment(project.period.end).format('DD.MM.yyyy')}`
                } else {
                    project.date = `c ${moment(project.period.start).format('DD.MM.yyyy')}`
                }
            })
            result.projects = projects
        })
        
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            // contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        req.params.type = "GRANTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.text = data.text
        })
        renderGrantListPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderGrantListPage = function(req, res, data) {
    res.render('projects-list', {
        title: 'Гранты и субсидии',
        projects: data.projects, 
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session,
        text: data.text,
        shops: data.shops
    })
}


module.exports.getGrantPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.query.filter_visible = true
        await apiProjects.getProjectByPath(req, res, async (req, res, project) => {

            if (project.period.end) {
                project.date = `${moment(project.period.start).format('DD.MM.yyyy')} - ${moment(project.period.end).format('DD.MM.yyyy')}`
            } else {
                project.date = `c ${moment(project.period.start).format('DD.MM.yyyy')}`
            }
            result.project = project
        })
        
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        renderGrantPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderGrantPage = function(req, res, data) {
    res.render('project', {
        title: data.project ? data.project.name : "Не найдено",
        project: data.project,
        contacts: data.contacts,
        programs: data.programs, 
        session: req.session,
        shops: data.shops
    })
}


module.exports.toggleLike = async (req, res) => {
    try {
        await apiProjects.toggleLike(req, res, (req, res, message) => {
            res.redirect(req.headers.referer)
        })
    } catch (e) {
        console.log(e)
    }
}

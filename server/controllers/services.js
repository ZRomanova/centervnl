const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')
const apiServices = require('../api/controllers/services')
const moment = require('moment')

module.exports.getServicesListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getProjects(req, res, async (req, res, projects) => {
                result.projects = projects
                await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                    result.nav_projects = nav_projects
                    await apiServices.getServices(req, res, async (req, res, services) => {
                        const now = new Date()
                        services.forEach(service => {
                            if (service.date) {
                                if (service.date.single && service.date.single.length) {
                                    service.date.single.forEach(d => {
                                        d.text = []
                                        if (new Date(d) > now) {
                                            d.text.push(moment(d).format('DD.MM.YYYY HH:mm'))
                                            service.active = true
                                        }
                                    })
                                }
                                if (!!service.date.period && service.date.period.length) {
                                    service.date.period.forEach(p =>  {
                                        p.text = []
                                        if ((new Date(p.start) <= now) && (!p.end || new Date(p.end) > now) && p.visible) {
                                            p.text.push(`${p.day} ${intToStringDate(p.time)}`)
                                            service.active = true
                                        }
                                    })
                                }
                            } 
                        })
                        result.services = {active: services.filter(el => el.active && el.visible), inactive: services.filter(el => !el.active && el.visible)}
                        renderServicesListPage(req, res, result)
                    })
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const intToStringDate = (num) => {
    const hour = 1000 * 60 * 60 
    const minute = 1000 * 60
    let resH = Math.floor(num / hour) 
    let resM = Math.round((num - resH * hour) / minute)
    if (resH < 10) resH = "0" + resH
    if (resM < 10) resM = "0" + resM
    return `${resH}:${resM}`
}

const renderServicesListPage = function(req, res, data) {
    res.render('services-list', {
        title: 'Мероприятия',
        projects: data.projects,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        services: data.services,
        user: req.user
    })
}

module.exports.getServicePage = async function(req, res) {
    try {
        const result = {}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getProjects(req, res, async (req, res, projects) => {
                result.projects = projects
                await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                result.nav_projects = nav_projects
                    await apiServices.getServiceByPath(req, res, async (req, res, service) => {
                        const now = new Date()
                        if (service.date.single && service.date.single.length) {
                            service.date.single.forEach(d => {
                                d.text = []
                                if (new Date(d) > now) {
                                    d.text.push(moment(d).format('DD.MM.YYYY HH:mm'))
                                    service.active = true
                                }
                            })
                        }
                        if (!!service.date.period && service.date.period.length) {
                            service.date.period.forEach(p =>  {
                                p.text = []
                                if ((new Date(p.start) <= now) && (!p.end || new Date(p.end) > now) && p.visible) {
                                    p.text.push(`${p.day} ${intToStringDate(p.time)}`)
                                    service.active = true
                                }
                            })
                        }
                        result.service = service
                        renderServicePage(req, res, result)
                    })
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}


const renderServicePage = function(req, res, data) {
    res.render('service', {
        title: data.name,
        projects: data.projects,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        service: data.service,
        user: req.user
    })
}
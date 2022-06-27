const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')
const apiServices = require('../api/controllers/services')
const apiRegistrations = require('../api/controllers/registrations')
const apiShops = require('../api/controllers/shops')
const FormAnswer = require('../api/models/dk-form')
const moment = require('moment')
moment.locale('ru')

const week = [
    {
        num: 1,
        en:'monday',
        ru: 'ПН'
    },
    {
        num: 2,
        en: 'tuesday',
        ru: 'ВТ'
    },
    {
        num: 3,
        en: 'wednesday',
        ru: 'СР'
    },
    {
        num: 4,
        en: 'thursday',
        ru: 'ЧТ'
    },
    {
        num: 5,
        db: 'friday',
        ru: 'ПТ'
    },
    {
        num: 6,
        en: 'saturday',
        ru: 'СБ'
    },
    {
        num: 0,
        en: 'sunday',
        ru: 'ВС'
    }
]

module.exports.getServicesListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                result.nav_projects = nav_projects
                req.query.filter_visible = true
                await apiServices.getServices(req, res, async (req, res, services) => {
                    const now = new Date(new Date() - 1000 * 60 * 60 * 2)
                    services.forEach(service => {
                        if (service.date) {
                            if (service.date.single && service.date.single.length) {
                                service.date.single.forEach(d => {
                                    if (new Date(d) > now) {
                                        d.text_active = moment(d).format('DD.MM.YYYY HH:mm')
                                        service.active = true
                                    } 
                                })
                            }
                            if (!!service.date.period && service.date.period.length) {
                                service.date.period.forEach(p =>  {
                                    if ((new Date(p.start) <= now) && (!p.end || new Date(p.end) > now) && p.visible) {
                                        service.active = true
                                        p.text_active = `${p.day} ${intToStringDate(p.time)}`
                                    }
                                })
                            }
                        } 
                    })
                    result.services = {active: services.filter(el => el.active && el.visible), inactive: services.filter(el => !el.active && el.visible)}
                    await apiShops.getShops(req, res, (req, res, shops) => {
                        result.shops = shops
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
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        services: data.services,
        user: req.user,
        shops: data.shops
    })
}

module.exports.getServicePage = async function(req, res) {
    try {
        const result = {}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners

            await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
            result.nav_projects = nav_projects
                await apiServices.getServiceByPath(req, res, async (req, res, data) => {
                    const service = data.service
                    service.dates = []
                    result.posts = data.posts
                    const now = new Date(new Date() - 1000 * 60 * 60 * 2)
                    if (service.date.single && service.date.single.length) {
                        for await (const d of service.date.single)  {
                            if (new Date(d) > now) {
                                let obj = await apiRegistrations.check(req.user, new Date(d), service)
                                service.dates.push({text: moment(d).format('D MMMM YYYY HH:mm[,] dddd'), date: d, isReg: obj.isReg, count: obj.count })
                                service.active = true
                            } else {
                                d.text_inactive = moment(d).format('D MMMM YYYY HH:mm[,] dddd')
                            }
                        }
                    }
                    if (!!service.date.period && service.date.period.length) {
                        for await (const p of service.date.period)  {
                            if ((!p.end || new Date(p.end) > now) && p.visible) {
                                const day = week.find(el => el.ru == p.day).num
                                let iDate = new Date(now)
                                if (new Date(p.start) > now) iDate = new Date(p.start)
                                iDate.setHours(0)
                                iDate.setMinutes(0)
                                iDate.setSeconds(0)
                                iDate.setMilliseconds(p.time)
                                iDate = new Date(iDate)
                                if (iDate < now)
                                    iDate = new Date(Date.parse(iDate) + (1000 * 60 * 60 * 24))
                                for (let i = 0; i < 7; i++) {
                                    if (iDate.getDay() == day) break
                                    iDate = new Date(Date.parse(iDate) + (1000 * 60 * 60 * 24))
                                }
                                const end = p.end ? new Date(p.end) : new Date(Date.parse(iDate) + (1000 * 60 * 60 * 24 * 28))
                                while (iDate < end) {
                                    let obj = await apiRegistrations.check(req.user, new Date(iDate), service)
                                    service.dates.push({text: moment(iDate).format('D MMMM YYYY HH:mm[,] dddd'), date: iDate, isReg: obj.isReg, count: obj.count})
                                    iDate = new Date(Date.parse(iDate) + (1000 * 60 * 60 * 24 * 7))
                                }
                                service.active = true
                            }
                        }
                    }
                    service.dates = service.dates.sort((a, b) => a.date - b.date)
                    result.service = service
                    await apiShops.getShops(req, res, (req, res, shops) => {
                        result.shops = shops
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
        title: data.service ? data.service.name : 'Не найдено',
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        service: data.service,
        user: req.user,
        posts: data.posts,
        shops: data.shops
    })
}

module.exports.toggleLike = async (req, res) => {
    try {
        await apiServices.toggleLike(req, res, (req, res, message) => {
            res.redirect(req.headers.referer)
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.createRegistration = async (req, res) => {
    try {
        await apiRegistrations.create(req, res, (req, res, reg) => {
            res.redirect('/profile/checkout')
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.dkTest = async function(req, res,) {
    try {
        const result = {}
        await apiPartners.getPartners(req, res, (req, res, partners) => {
            result.partners = partners
        })
        await apiProjects.getActive(req, res, (req, res, projects) => {
            result.projects = projects
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        if (req.user)
            result.isRepit = !!await FormAnswer.findOne({user: req.user._id}, {_id: 1}).lean()
        renderDKtest(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderDKtest = function(req, res, data) {
    res.render('dk-test', {
        title: 'ДоброКолледж',
        nav_projects: data.projects,
        footer_logos: data.partners, 
        user: req.user,
        shops: data.shops,
        isRepit: data.isRepit
    })
    
}

module.exports.dkCheck = async function (req, res) {
    const form = req.body
    form.user = req.user
    await new FormAnswer(form).save()
    res.redirect('/services')
}
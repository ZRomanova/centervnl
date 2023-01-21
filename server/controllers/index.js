const apiPartners = require('../api/controllers/partners')
const apiData = require('../api/controllers/data')
const apiPrograms = require('../api/controllers/programs')
const apiProjects = require('../api/controllers/projects')
const apiShops = require('../api/controllers/shops')
const apiUser = require('../api/controllers/auth')
const apiDocs = require('../api/controllers/docs')
const apiReports = require('../api/controllers/reports')
const apiRegistrations = require('../api/controllers/registrations')
const apiOrders = require('../api/controllers/orders')
const apiPosts = require('../api/controllers/posts')
const apiPress = require('../api/controllers/press')
const moment = require('moment')
moment.locale('ru')

module.exports.getHomePage = async function(req, res, data = {}) {
    try {
        if (data.user) req.user = data.user
        const result = {session: req.session}
        req.query.filter_visible = true
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })

        req.params.type = "GALLERY"
        await apiData.getByType(req, res, (req, res, gallery) => {
            result.gallery = gallery.filter(el => el.image && el.visible)
            result.gallery = gallery.filter((el, index) => index < 4)
        })
        
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        req.query.fields_icon = 1
        req.query.fields_subtitle = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        req.query = {limit: 2, offset: 0}
        await apiPosts.getPosts(req, res, (req, res, posts) => {
            posts.forEach(post => {
                post.date = moment(post.date).format('D MMMM yyyy')
            })
            result.posts = posts
        })
        renderHomePage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderHomePage = function(req, res, data) {
    res.render('index', {
        title: 'Ресурсный центр Вера Надежда Любовь',
        text: data.description,
        contacts: data.contacts,
        programs: data.programs,
        gallery: data.gallery,
        posts: data.posts,
        user: data.user,
        shops: data.shops
    })
    
}





module.exports.getProfilePage = async function(req, res,) {
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
        await apiUser.profile(req, res, (req, res, profile) => {
            result.profile = profile
        })
        renderProfilePage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderProfilePage = function(req, res, data) {
    res.render('profile', {
        title: req.user.name + ' ' + req.user.surname,
        nav_projects: data.projects,
        footer_logos: data.partners, 
        session: req.session,
        profile: data.profile,
        shops: data.shops
    })
    
}

module.exports.getCreateOrder = async function(req, res,) {
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
        await apiOrders.addToBin(req, res, (req, res, bin) => {
            result.bin = bin
        })
        renderCreateOrder(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderCreateOrder = function(req, res, data) {
    res.render('create-order', {
        title: 'Новый заказ',
        nav_projects: data.projects,
        footer_logos: data.partners, 
        session: req.session,
        bin: data.bin,
        shops: data.shops
    })
}

module.exports.changeStatusCheckouts = async (req, res) => {
    try {
        await apiRegistrations.toggleStatus(req, res, (req, res, message) => {
            res.redirect(req.headers.referer)
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.getProfileCheckouts = async function(req, res,) {
    try {
        const result = {}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getActive(req, res, async (req, res, projects) => {
                result.projects = projects
                await apiShops.getShops(req, res, async (req, res, shops) => {
                    result.shops = shops
                    await apiRegistrations.getByUser(req, res, (req, res, checkouts) => {
                        result.checkouts = checkouts
                        renderProfileCheckouts(req, res, result)
                    })
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderProfileCheckouts = function(req, res, data) {
    res.render('checkouts', {
        title: req.user.name + ' ' + req.user.surname,
        nav_projects: data.projects,
        footer_logos: data.partners, 
        session: req.session,
        checkouts: data.checkouts,
        shops: data.shops
    })
}

module.exports.createOrder = async (req, res) => {
    try {
        await apiOrders.toggleStatus(req, res, (req, res, message) => {
            res.redirect('/profile/orders')
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.getProfileOrders = async function(req, res,) {
    try {
        const result = {}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getActive(req, res, async (req, res, projects) => {
                result.projects = projects
                await apiShops.getShops(req, res, async (req, res, shops) => {
                    result.shops = shops
                    await apiOrders.getByUser(req, res, (req, res, orders) => {
                        result.orders = orders
                        renderProfileOrders(req, res, result)
                    })
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderProfileOrders = function(req, res, data) {
    res.render('orders', {
        title: req.user.name + ' ' + req.user.surname,
        nav_projects: data.projects,
        footer_logos: data.partners, 
        session: req.session,
        orders: data.orders,
        shops: data.shops
    })
}








module.exports.submitForm = async function(req, res) {
    try {
        await apiUser.fillForm(req)
        res.redirect(req.headers.referer)
    } catch (e) {
        console.log(e)
    }
}



module.exports.getDocsPage = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = 1
        req.params.type = "REPORTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.text = data.text
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.contacts = data
        })
        await apiReports.getReports(req, res, (req, res, docs) => {
            result.reports = docs
        })

        await apiDocs.getDocuments(req, res, (req, res, docs) => {
            result.docs = docs.filter(doc => doc.visible && doc.name && doc.file)
        })
        req.query.fields_name = 1
        
        req.query.fields_path = 1
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        renderDocsPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderDocsPage = function(req, res, data) {
    res.render('docs', {
        title: 'Документы и отчеты',
        programs: data.programs,
        contacts: data.contacts,
        text: data.text, 
        session: req.session,
        shops: data.shops,
        docs: data.docs,
        reports: data.reports,
    })
    
}


module.exports.getPartnersPage = async function(req, res,) {
    try {
        const result = {}
        await apiPartners.getPartners(req, res, (req, res, partners) => {
            result.partners = partners.filter(p => p.image)
        })
        req.params.type = "PARTNERS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.text = data ? data.text : ''
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.contacts = data
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        renderPartnersPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderPartnersPage = function(req, res, data) {
    res.render('partners', {
        title: 'Наши партнеры',
        text: data.text,
        contacts: data.contacts,
        programs: data.programs, 
        partners: data.partners, 
        session: req.session,
        shops: data.shops
    })
}

module.exports.getPolicyPage = async function(req, res,) { 
    try {
        const result = {}
        req.query.filter_visible = true
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        await apiPartners.getPartners(req, res, (req, res, partners) => {
            result.partners = partners
        })
        await apiProjects.getActive(req, res, (req, res, projects) => {
            result.projects = projects
        })

        req.query.fields_name = 1
        req.query.fields_path = 1

        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        renderPolicyPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderPolicyPage = function(req, res, data) {
    res.render('policy', {
        title: 'Обработка персональных данных',
        contacts: data.contacts,
        programs: data.programs,
        user: data.user,
        shops: data.shops
    })
}


module.exports.getSmiPage = async function(req, res,) {
    try {
        const result = {}
        req.query.filter_visible = true
        await apiPress.getDocuments(req, res, (req, res, posts) => {
            posts.forEach(p => p.date = moment(p.date).format('DD.MM.yyyy'))
            result.posts = posts
        })
        req.params.type = "SMI"
        await apiData.getByType(req, res, (req, res, data) => {
            result.text = data ? data.text : ''
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.contacts = data
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        renderSmiPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderSmiPage = function(req, res, data) {
    res.render('smi-list', {
        title: 'СМИ о нас',
        text: data.text,
        contacts: data.contacts,
        programs: data.programs, 
        posts: data.posts, 
        session: req.session,
        shops: data.shops
    })
}

module.exports.getGalleryPage = async function(req, res,) {
    try {
        const result = {}
        req.query.filter_visible = true

        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.contacts = data
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        renderGalleryPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderGalleryPage = function(req, res, data) {
    res.render('gallery', {
        title: 'Фото и видео',
        // text: data.text,
        contacts: data.contacts,
        programs: data.programs, 
        // posts: data.posts, 
        session: req.session,
        shops: data.shops
    })
}


module.exports.getContactsPage = async function(req, res,) {
    try {
        const result = {}
        req.query.filter_visible = true

        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.contacts = data
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        renderContactsPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderContactsPage = function(req, res, data) {
    res.render('contacts', {
        title: 'Контакты',
        // text: data.text,
        contacts: data.contacts,
        programs: data.programs, 
        // posts: data.posts, 
        session: req.session,
        shops: data.shops
    })
}

module.exports.getErrorPage = async function(req, res) {
    try {
        const result = {}
        result.error = {
            message: res.locals.message,
            status: res.statusCode
        }

        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, data) => {
            result.contacts = data
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })

        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        renderErrorPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderErrorPage = function(req, res, data) {
    res.render('error', {
        title: 'Ошибка',
        programs: data.programs,
        contacts: data.contacts,
        session: req.session,
        shops: data.shops,
        error: data.error,
    })
    
}
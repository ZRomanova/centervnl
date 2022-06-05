const apiPartners = require('../api/controllers/partners')
const apiData = require('../api/controllers/data')
const apiPosts = require('../api/controllers/posts')
const apiServices = require('../api/controllers/services')
const apiProjects = require('../api/controllers/projects')
const apiShops = require('../api/controllers/shops')
const apiUser = require('../api/controllers/auth')
const apiDocs = require('../api/controllers/docs')
const apiRegistrations = require('../api/controllers/registrations')
const apiOrders = require('../api/controllers/orders')
const apiTeam = require('../api/controllers/staffs')

module.exports.getHomePage = async function(req, res, data = {}) {
    try {
        if (data.user) req.user = data.user
        const result = {user: req.user}
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        req.params.type = "HOME"
        await apiData.getByType(req, res, (req, res, home) => {
            result.description = home.text
        })
        await apiPartners.getPartners(req, res, (req, res, partners) => {
            result.partners = partners
        })
        await apiServices.getAnouncements(req, res, (req, res, anouncements) => {
            result.anouncements = anouncements.filter(el => el.image)
        })
        await apiProjects.getActive(req, res, (req, res, projects) => {
            result.projects = projects
        })
        req.query = {offset: 0, limit: 16}
        await apiPosts.getPosts(req, res, (req, res, posts) => {
            result.posts = posts
        })
        req.params.type = "GALLERY"
        await apiData.getByType(req, res, (req, res, gallery) => {
            result.gallery = gallery.filter(el => el.image && el.visible)
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
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
        anouncements: data.anouncements,
        news: data.posts,
        contacts: data.contacts,
        nav_projects: data.projects,
        footer_logos: data.partners, 
        user: data.user,
        gallery: data.gallery,
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
        user: req.user,
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
        user: req.user,
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
        user: req.user,
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
        user: req.user,
        orders: data.orders,
        shops: data.shops
    })
}


module.exports.getTeamPage = async function(req, res) {
    try {
        const result = {}

        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiServices.getAnouncements(req, res, async (req, res, anouncements) => {
                result.anouncements = anouncements.filter(el => el.image)
                await apiProjects.getActive(req, res, async (req, res, projects) => {
                    result.projects = projects
                    await apiShops.getShops(req, res, async (req, res, shops) => {
                        result.shops = shops
                        req.query.visible = true
                        await apiTeam.getStaffs(req, res, (req, res, staffs) => {
                            result.staffs = staffs
                            renderTeamPage(req, res, result)
                        })
                    })
                        
                })
            })
        })

    } catch (e) {
        console.log(e)
    }
}

const renderTeamPage = function(req, res, data) {
    res.render('team', {
        title: 'Наша команда | Ресурсный центр Вера Надежда Любовь',
        anouncements: data.anouncements,
        team: data.staffs,
        nav_projects: data.projects,
        footer_logos: data.partners, 
        user: req.user,
        shops: data.shops
    })
    
}

module.exports.getDocsPage = async function(req, res,) {
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
        await apiDocs.getDocuments(req, res, (req, res, docs) => {
            result.docs = docs.filter(doc => doc.visible && doc.name && doc.file)
        })
        renderDocsPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderDocsPage = function(req, res, data) {
    res.render('docs', {
        title: 'Уставные документы',
        nav_projects: data.projects,
        footer_logos: data.partners, 
        user: req.user,
        shops: data.shops,
        docs: data.docs,
    })
    
}


module.exports.getGeographyPage = async function(req, res,) {
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
        renderGeographyPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderGeographyPage = function(req, res, data) {
    res.render('geography', {
        title: 'География деятельности',
        nav_projects: data.projects,
        footer_logos: data.partners, 
        user: req.user,
        shops: data.shops
    })
}
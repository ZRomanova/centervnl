const apiPartners = require('../api/controllers/partners')
const apiData = require('../api/controllers/data')
const apiPosts = require('../api/controllers/posts')
const apiServices = require('../api/controllers/services')
const apiProjects = require('../api/controllers/projects')
const apiShops = require('../api/controllers/shops')

module.exports.getHomePage = async function(req, res, data = {}) {
    try {
        if (data.user) req.user = data.user
        const result = {user: req.user}
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, async (req, res, contacts) => {
            result.contacts = contacts
            req.params.type = "HOME"
            await apiData.getByType(req, res, async (req, res, home) => {
                result.description = home.text
                await apiPartners.getPartners(req, res, async (req, res, partners) => {
                    result.partners = partners
                    await apiServices.getAnouncements(req, res, async (req, res, anouncements) => {
                        result.anouncements = anouncements.filter(el => el.image)
                        await apiProjects.getActive(req, res, async (req, res, projects) => {
                            result.projects = projects
                            req.query = {offset: 0, limit: 16}
                            await apiPosts.getPosts(req, res, async (req, res, posts) => {
                                result.posts = posts
                                req.params.type = "GALLERY"
                                await apiData.getByType(req, res, async (req, res, gallery) => {
                                    result.gallery = gallery.filter(el => el.image && el.visible)
                                    await apiShops.getShops(req, res, (req, res, shops) => {
                                        result.shops = shops
                                        renderHomePage(req, res, result)
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
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
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getActive(req, res, async (req, res, projects) => {
                result.projects = projects
                await apiShops.getShops(req, res, (req, res, shops) => {
                    result.shops = shops
                    renderProfilePage(req, res, result)
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}


const renderProfilePage = function(req, res, data) {
    res.render('profile', {
        title: data.user.name + ' ' + data.user.surname,
        nav_projects: data.projects,
        footer_logos: data.partners, 
        user: data.user,
        shops: data.shops
    })
    
}


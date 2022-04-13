const apiPartners = require('../api/controllers/partners')
const apiData = require('../api/controllers/data')
const apiPosts = require('../api/controllers/posts')
const apiServices = require('../api/controllers/services')
const apiProjects = require('../api/controllers/projects')

module.exports.getHomePage = async function(req, res, data = {}) {
    try {
        if (data.user) req.session.passport.user = data.user
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
                        result.anouncements = anouncements
                        await apiProjects.getActive(req, res, async (req, res, projects) => {
                            result.projects = projects
                            req.query = {offset: 0, limit: 16}
                            await apiPosts.getPosts(req, res, (req, res, posts) => {
                                result.posts = posts
                                renderHomePage(req, res, result)
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
        title: 'Главная',
        text: data.description,
        anouncements: data.anouncements,
        news: data.posts,
        contacts: data.contacts,
        nav_projects: data.projects,
        footer_logos: data.partners, 
        user: data.user
    })
    
}


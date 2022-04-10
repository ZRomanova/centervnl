const apiPartners = require('../api/controllers/partners')
const apiData = require('../api/controllers/data')
const apiBlog = require('../api/controllers/blog')
const apiProjects = require('../api/controllers/projects')

module.exports.getHomePage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiData.getContacts(req, res, async (req, res, contacts) => {
            result.contacts = contacts
            await apiData.getHomeText(req, res, async (req, res, home) => {
                result.description = home.text
                await apiPartners.getPartners(req, res, async (req, res, partners) => {
                    result.partners = partners
                    await apiBlog.getAnouncements(req, res, async (req, res, anouncements) => {
                        result.anouncements = anouncements
                        await apiProjects.getActive(req, res, async (req, res, projects) => {
                            result.projects = projects
                            req.query = {offset: 0, limit: 16}
                            await apiBlog.getPosts(req, res, (req, res, posts) => {
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
        user: req.user
    })
    
}


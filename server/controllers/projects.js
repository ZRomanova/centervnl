const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')

module.exports.getProjectListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getProjects(req, res, async (req, res, projects) => {
                const arr = []
                const active = []
                const now = new Date()
                projects.forEach(p => {
                    if (p.visible && new Date(p.period.start) < now && (!p.period.end || new Date(p.period.end) > now)) {
                        active.push(p)
                    } else if (p.visible && p.period.end && new Date(p.period.end) < now){
                        const year = new Date(p.period.end).getFullYear()
                        const obj = arr.find(el => el.year == year)
                        if (obj) obj.projects.push(p)
                        else arr.push({year, projects: [p]})
                    }
                    arr.sort((a, b) => a.year > b.year)
                })
                result.old_projects = arr
                result.nav_projects = active
                renderProjectListPage(req, res, result)
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderProjectListPage = function(req, res, data) {
    res.render('projects-list', {
        title: 'Проекты',
        old_projects: data.old_projects,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user
    })
}


module.exports.getProjectPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getProjects(req, res, async (req, res, projects) => {
                result.projects = projects
                await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                    result.nav_projects = nav_projects
                    renderProjectListPage(req, res, result)
                    console.log('getProjectPage')
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')
const moment = require('moment')

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
                    arr.sort((a, b) => b.year - a.year)
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
            await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                result.nav_projects = nav_projects
                await apiProjects.getProjectByPath(req, res, async (req, res, data) => {
                    const project = data.project
                    result.services = data.services
                    result.posts = data.posts
                    moment.locale('ru')
                    if (project.period.end) {
                        project.date = `${moment(project.period.start).format('LL')} - ${moment(project.period.end).format('LL')}`
                    } else {
                        project.date = `c ${moment(project.period.start).format('LL')}`
                    }
                    result.project = project
                    renderProjectPage(req, res, result)
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderProjectPage = function(req, res, data) {
    res.render('project', {
        title: data.project ? data.project.name : "Не найдено",
        project: data.project,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user,
        posts: data.posts,
        services: data.services
    })
}

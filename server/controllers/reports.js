const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')
const apiShops = require('../api/controllers/shops')
const apiReports = require('../api/controllers/reports')
const apiData = require('../api/controllers/data')
const moment = require('moment')

moment.locale('ru')

module.exports.getReportsListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, (req, res, partners) => {
            result.partners = partners
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        await apiProjects.getActive(req, res, (req, res, nav_projects) => {
            result.nav_projects = nav_projects
        })
        await apiReports.getYears(req, res, (req, res, years) => {
            result.years = years
        })
        req.params.type = "REPORTS"
        await apiData.getByType(req, res, (req, res, home) => {
            result.text = home.text
        })
        renderReportListPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderReportListPage = function(req, res, data) {
    res.render('reports-list', {
        title: 'Годовые отчёты',
        text: data.text,
        years: data.years,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user,
        shops: data.shops
    })
}


module.exports.getReportPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, (req, res, partners) => {
            result.partners = partners
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        await apiProjects.getActive(req, res, (req, res, nav_projects) => {
            result.nav_projects = nav_projects
        })
        await apiReports.getReportByYear(req, res, (req, res, report) => {
            result.report = report
        })
        renderReportPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderReportPage = function(req, res, data) {
    res.render('report', {
        title: data.report ? data.report.title : "Не найдено",
        report: data.report,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user,
        shops: data.shops
    })
}


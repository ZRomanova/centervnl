const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')
const apiTeam = require('../api/controllers/staffs')
const moment = require('moment')

moment.locale('ru')

module.exports.getTeamList = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true

        await apiTeam.getStaffs(req, res, (req, res, staffs) => {
            result.staffs = staffs
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            // contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        req.params.type = "TEAM"
        await apiData.getByType(req, res, (req, res, data) => {
            result.text = data.text
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderTeamList(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderTeamList = function(req, res, data) {
    res.render('team-list', {
        title: 'Наша команда | Ресурсный центр Вера Надежда Любовь',
        team: data.staffs,
        text: data.text,
        programs: data.programs, 
        contacts: data.contacts, 
        session: req.session,
        shops: data.shops
    })
    
}

module.exports.getTeamPage = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        await apiTeam.getStaffByPath(req, res, (req, res, staff) => {
            result.staff = staff
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            // contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderTeamPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderTeamPage = function(req, res, data) {
    res.render('team', {
        title: `${data.staff.name} ${data.staff.surname} | Ресурсный центр Вера Надежда Любовь`,
        staff: data.staff,
        programs: data.programs, 
        contacts: data.contacts, 
        session: req.session,
        shops: data.shops
    })
    
}
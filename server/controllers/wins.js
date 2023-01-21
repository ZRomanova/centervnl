const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')
const apiWins = require('../api/controllers/wins')
const moment = require('moment')

moment.locale('ru')

module.exports.getWinsList = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        
        await apiWins.getWins(req, res, (req, res, items) => {
            result.wins = items
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            // contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        req.params.type = "WINS"
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
        renderWinsList(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderWinsList = function(req, res, data) {
    res.render('wins-list', {
        title: 'Наши победы | Ресурсный центр Вера Надежда Любовь',
        wins: data.wins,
        text: data.text,
        programs: data.programs, 
        contacts: data.contacts, 
        user: req.user,
        shops: data.shops
    })
    
}

module.exports.getWinPage = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        await apiWins.getWinByPath(req, res, (req, res, item) => {
            result.win = item
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
        renderWinPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderWinPage = function(req, res, data) {
    res.render('win', {
        title: `${data.win.name} | Ресурсный центр Вера Надежда Любовь`,
        win: data.win,
        programs: data.programs, 
        contacts: data.contacts, 
        user: req.user,
        shops: data.shops
    })
    
}
const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')
const moment = require('moment')

moment.locale('ru')

module.exports.getHelpList = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        renderHelpList(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderHelpList = function(req, res, data) {
    res.render('help-list', {
        title: 'Как помочь | Ресурсный центр Вера Надежда Любовь',
        programs: data.programs, 
        contacts: data.contacts, 
        user: req.user,
        shops: data.shops
    })
    
}


module.exports.getHelpDonate = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        renderHelpDonate (req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderHelpDonate  = function(req, res, data) {
    res.render('help-donate', {
        title: 'Сделать пожертвование | Ресурсный центр Вера Надежда Любовь',
        programs: data.programs, 
        contacts: data.contacts, 
        user: req.user,
        shops: data.shops
    })
    
}
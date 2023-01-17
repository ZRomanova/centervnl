const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')
const moment = require('moment')

moment.locale('ru')

module.exports.getParentsList = async function(req, res) {
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
        renderParentsList(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderParentsList = function(req, res, data) {
    res.render('parents-list', {
        title: 'Родителям | Ресурсный центр Вера Надежда Любовь',
        programs: data.programs, 
        contacts: data.contacts, 
        user: req.user,
        shops: data.shops
    })
    
}

module.exports.getParentsPage = async function(req, res) {
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
        renderParentsPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderParentsPage = function(req, res, data) {
    res.render('team', {
        title: `${data.staff.name} ${data.staff.surname} | Ресурсный центр Вера Надежда Любовь`,
        staff: data.staff,
        programs: data.programs, 
        contacts: data.contacts, 
        user: req.user,
        shops: data.shops
    })
    
}

module.exports.getParentsClub = async function(req, res) {
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
      renderParentsClub(req, res, result)
  } catch (e) {
      console.log(e)
  }
}

const renderParentsClub = function(req, res, data) {
  res.render('team', {
      title: `${data.staff.name} ${data.staff.surname} | Ресурсный центр Вера Надежда Любовь`,
      staff: data.staff,
      programs: data.programs, 
      contacts: data.contacts, 
      user: req.user,
      shops: data.shops
  })
  
}
const apiPrograms = require('../api/controllers/programs')
const apiParents = require('../api/controllers/parents')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')
const moment = require('moment')

moment.locale('ru')

module.exports.getParentsList = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        
        await apiParents.getPages(req, res, async (req, res, pages) => {
            result.pages = pages
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
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
        pages: data.pages, 
        session: req.session,
        shops: data.shops
    })
    
}

module.exports.getParentsPage = async function(req, res) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        await apiParents.getPageByPath(req, res, async (req, res, page) => {
            result.page = page
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderParentsPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderParentsPage = function(req, res, data) {
    res.render('parents', {
        title: data.page ? data.page.name : "Не найдено",
        staff: data.staff,
        programs: data.programs, 
        page: data.page, 
        contacts: data.contacts, 
        session: req.session,
        shops: data.shops
    }) 
}

module.exports.getParentsClub = async function(req, res) {
  try {
      const result = {}
      req.query.filter_visible = true
      req.params.type = "CONTACTS"
      await apiData.getByType(req, res, (req, res, contacts) => {
          result.contacts = contacts
      })
      req.params.type = "PARENTS_CLUB"
      await apiData.getByType(req, res, (req, res, club) => {
          result.club = club
      })
      req.query.fields_name = 1
      req.query.fields_path = 1
      await apiPrograms.getPrograms(req, res, (req, res, programs) => {
          result.programs = programs
      })
      await apiShops.getShops(req, res, async (req, res, shops) => {
        result.shops = shops
    })
      renderParentsClub(req, res, result)
  } catch (e) {
      console.log(e)
  }
}

const renderParentsClub = function(req, res, data) {
  res.render('parents-club', {
      title: `Родительский клуб | Ресурсный центр Вера Надежда Любовь`,
      staff: data.staff,
      programs: data.programs, 
      contacts: data.contacts, 
      club: data.club, 
      session: req.session,
      shops: data.shops
  })
  
}
const apiProducts = require('../api/controllers/products')
const apiOrders = require('../api/controllers/orders')
const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')

module.exports.getShopPage = async function(req, res, data = {}) {
    try {
        const result = {...data}

        req.query.filter_visible = true
        
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })

        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        req.query.fields_icon = 1
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })

        renderShopPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderShopPage = function(req, res, data) {
    res.render('shop-main', {
        title: `Maгазин`,
        shops: data.shops,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}


module.exports.getCatalogsList = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.query.filter_visible = true
        
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        await apiShops.getShopById(req, res, (req, res, shop) => {
            result.shop = shop
        })
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        req.query.fields_icon = 1
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        renderCatalogsList(req, res, result)
    } catch (e) {
        console.log(e)
    }
}


const renderCatalogsList = function(req, res, data) {
    res.render('shop-catalogs', {
        title: data.shop ? data.shop.name : `Maгазин`,
        shops: data.shops,
        shop: data.shop,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}



module.exports.getProductPage = async function(req, res, data = {}) {
    try {
        const result = {}
        req.query.filter_visible = true
        
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        req.params.id = req.params.product
        await apiProducts.getProductById(req, res, (req, res, product) => {
            result.product = product
        })
        req.params.id = req.params.shop
        await apiShops.getShopById(req, res, (req, res, shop) => {
            result.shop = shop
            result.catalog = shop.groups.find(item => item.path == req.params.group)
        })
        
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        renderProductPage(req, res, result)
        
    } catch (e) {
        console.log(e)
    }
}

const renderProductPage = function(req, res, data) {
    res.render('shop-product', {
        title: data.catalog ? data.catalog.name : "Не найдено",
        shops: data.shops,
        shop: data.shop,
        catalog: data.catalog,
        product: data.product,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}



module.exports.getCatalogPage = async (req, res) => {
    try {
        const result = {}
        req.query.filter_visible = true
        
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        req.params.id = req.params.shop
        await apiShops.getShopById(req, res, (req, res, shop) => {
            result.shop = shop
            result.catalog = shop.groups.find(item => item.path == req.params.group)
        })
        
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        req.query["fields_groups.$"] = 1
        req.query.filter__id = result.shop._id
        req.query["filter_groups._id"] = result.catalog._id
        await apiProducts.getProducts(req, res, (req, res, products) => {
            result.products = products
        })
        renderCatalogPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}


const renderCatalogPage = function(req, res, data) {
    res.render('shop-catalog', {
        title: data.catalog ? data.catalog.name : "Не найдено",
        shops: data.shops,
        shop: data.shop,
        catalog: data.catalog,
        products: data.products,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}
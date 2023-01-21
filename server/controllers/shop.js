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
        user: req.user
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
        user: req.user
    })
}



module.exports.getProductPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                result.nav_projects = nav_projects
                await apiShops.getShops(req, res, async (req, res, shops) => {
                    result.shops = shops
                    await apiProducts.getProductOne(req, res, async (req, res, product) => {
                        if (product.visible) {
                            result.product = product
                            await apiOrders.addToBin(req, res, (req, res, bin) => {
                                result.bin = bin
                                renderProductPage(req, res, result)
                            })
                            
                        }
                        else {
                            res.status(404).json({massage: "Товар не найден"})
                        }
                        
                    })
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderProductPage = function(req, res, data) {
    res.render('product', {
        title: data.product.name,
        product: data.product,
        shops: data.shops,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user,
        bin: data.bin
    })
}



module.exports.redirectToShop = async (req, res) => {
    try {
        await apiShops.getShopById(req, res, (req, res, shop) => {
            res.redirect('/shop/' + shop.path)
        })
    } catch (e) {
        console.log(e)
    }
}



const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')
const apiShops = require('../api/controllers/shops')

module.exports.getShopPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                result.nav_projects = nav_projects
                await apiShops.getProductsInShop(req, res, async (req, res, obj) => {
                    result.products = obj.products
                    result.shop = obj.shop
                    await apiShops.getShops(req, res, (req, res, shops) => {
                        result.shops = shops
                        renderShopPage(req, res, result)
                    })
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderShopPage = function(req, res, data) {
    res.render('shop', {
        title: `Maгазин | ${data.shop.name}`,
        products: data.products,
        shop: data.shop,
        shops: data.shops,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user
    })
}

module.exports.getProductPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getProjects(req, res, async (req, res, projects) => {
                result.projects = projects
                await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                    result.nav_projects = nav_projects
                    await apiShops.getShops(req, res, (req, res, shops) => {
                        result.shops = shops
                        renderProductPage(req, res, result)
                    })
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderProductPage = function(req, res, data) {
    res.render('new-page', {
        title: 'Maгазин',
        projects: data.projects,
        shops: data.shops,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user
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


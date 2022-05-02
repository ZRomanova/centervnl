const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')
const apiProducts = require('../api/controllers/products')
const apiShops = require('../api/controllers/shops')
const apiOrders = require('../api/controllers/orders')

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
                    await apiShops.getShops(req, res, async (req, res, shops) => {
                        result.shops = shops
                        await apiOrders.addToBin(req, res, (req, res, bin) => {
                            result.bin = bin
                            renderShopPage(req, res, result)
                        })
                        
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
        user: req.user,
        bin: data.bin
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

module.exports.toggleLike = async (req, res) => {
    try {
        await apiProducts.toggleLike(req, res, (req, res, message) => {
            res.redirect(req.headers.referer)
        })
    } catch (e) {
        console.log(e)
    }
}


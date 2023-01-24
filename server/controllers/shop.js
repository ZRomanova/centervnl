const apiProducts = require('../api/controllers/products')
const apiOrders = require('../api/controllers/orders')
const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')

module.exports.getShopPage = async function(req, res, data = {}) {
    try {
        const result = {...data}

        await apiOrders.getBasketById(req, res, (req, res, basket) => {
            result.basket = basketFormat(basket)
        })

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
        basket: data.basket,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}


module.exports.getCatalogsList = async function(req, res, data = {}) {
    try {
        const result = {...data}

        await apiOrders.getBasketById(req, res, (req, res, basket) => {
            result.basket = basketFormat(basket)
        })

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
        basket: data.basket,
        shop: data.shop,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}


module.exports.getCatalogPage = async (req, res) => {
    try {
        const result = {}
        await apiOrders.getBasketById(req, res, (req, res, basket) => {
            result.basket = basketFormat(basket)
        })
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
        basket: data.basket,
        shop: data.shop,
        catalog: data.catalog,
        products: data.products,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}

module.exports.getProductPage = async function(req, res, data = {}) {
    try {
        const result = {}
        await apiOrders.getBasketById(req, res, (req, res, basket) => {
            result.basket = basketFormat(basket)
        })
        req.query.filter_visible = true
        
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            result.contacts = contacts
        })
        req.params.id = req.params.product
        await apiProducts.getProductById(req, res, (req, res, product) => {
            result.product = product
            // console.log(product.options[0])
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
        basket: data.basket,
        catalog: data.catalog,
        product: data.product,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}

const basketFormat = (basket) => {
    let products = []
    if (basket && basket.products && basket.products.length) {
        products = basket.products
    } 
    let price_all = 0
    let count_all = 0
    products.forEach(item => {
        count_all += item.count
        price_all += item.price * item.count
    })

    let product_text = 'товар'
    let count_text = String(count_all)

    if  ( ['11', '12', '13', '14'].includes(count_text.slice(-2))) {
        product_text+= 'ов'
    } 
    else if (['1'].includes(count_text.slice(-1))) {

    } else if (['2', '3', '4'].includes(count_text.slice(-2))) {
        product_text+= 'а'
    } else {
        product_text+= 'ов'
    }
    return {
        text: product_text, price: price_all, count: count_all
    }
}

module.exports.getBasketPage = async function(req, res, data = {}) {
    try {
        const result = {...data}

        await apiOrders.getBasketById(req, res, (req, res, basket) => {
            if (!basket || !basket.products || !basket.products.lenght) {
                basket = {products: []}
            }
            basket.total = basket.products.reduce((prev, curr) => {
                return prev += (curr.count * curr.price)
            }, 0)
            result.basket = basket
        })

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
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        let back = req.headers.referer
        if (!back || back.indexOf("centervnl.ru/shop") == -1) back = "/shop/"
        result.back = back

        renderBasketPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderBasketPage = function(req, res, data) {
    res.render('shop-basket', {
        title: "Корзина",
        shops: data.shops,
        basket: data.basket,
        programs: data.programs, 
        contacts: data.contacts,
        back: data.back,
        session: req.session
    })
}








module.exports.getOrderPage = async function(req, res, data = {}) {
    try {
        const result = {...data}

        await apiOrders.getBasketById(req, res, (req, res, basket) => {
            if (!basket || !basket.products || !basket.products.lenght) {
                basket = {products: []}
            }
            basket.total = basket.products.reduce((prev, curr) => {
                return prev += (curr.count * curr.price)
            }, 0)
            if (!basket.total) res.redirect('/shop/basket/')
            result.basket = basket
        })

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
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })

        renderOrderPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}


const renderOrderPage = function(req, res, data) {
    res.render('shop-order', {
        title: "Оформление заказа",
        shops: data.shops,
        basket: data.basket,
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session
    })
}
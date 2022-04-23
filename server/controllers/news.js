const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')
const apiPosts = require('../api/controllers/posts')
const apiShops = require('../api/controllers/shops')
const moment = require('moment')

moment.locale('ru')

module.exports.getNewsListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                result.nav_projects = nav_projects
                // req.query.limit = '20'
                req.query.offset = '0'
                req.query.filter_visible = true
                await apiPosts.getPosts(req, res, async (req, res, posts) => {
                    posts.forEach(post => {
                        post.date = moment(post.date).calendar(null,{
                            lastDay : '[вчера]',
                            sameDay : '[сегодня]',
                            lastWeek : '[в прошлый] dddd',
                            sameElse : 'll'
                        }) 
                    })
                    result.posts = posts
                    
                    await apiShops.getShops(req, res, (req, res, shops) => {
                        result.shops = shops
                        renderNewsListPage(req, res, result)
                    })
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderNewsListPage = function(req, res, data) {
    res.render('posts-list', {
        title: 'Новости',
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user,
        posts: data.posts,
        shops: data.shops
    })
}

module.exports.getNewsPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiPosts.getPostByPath(req, res, async (req, res, post) => {
                post.date = moment(post.date).calendar(null,{
                    lastDay : '[вчера]',
                    sameDay : '[сегодня]',
                    lastWeek : '[в прошлый] dddd',
                    sameElse : 'll'
                })
                post.servicesObjArray.forEach(el => {
                    el.color = 'btn-danger'
                    el.url = '/services/' + el.path
                })
                post.projectsObjArray.forEach(el => {
                    el.color = 'btn-primary'
                    el.url = '/projects/' + el.path
                })
                post.partnersObjArray.forEach(el => {
                    el.color = 'btn-success'
                })
                post.tagsObjArray.forEach(el => {
                    el.color = 'btn-warning'
                })
                post.links = [...post.tagsObjArray, ...post.partnersObjArray, ...post.projectsObjArray, ...post.servicesObjArray]
                post.links.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase())
                result.post = post
                
                await apiShops.getShops(req, res, (req, res, shops) => {
                    result.shops = shops
                    renderPostPage(req, res, result)
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderPostPage = function(req, res, data) {
    res.render('post', {
        title: data.post.name,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user,
        post: data.post,
        shops: data.shops
    })
}

module.exports.toggleLike = async (req, res) => {
    try {
        await apiPosts.toggleLike(req, res, (req, res, message) => {
            res.redirect(req.headers.referer)
        })
    } catch (e) {
        console.log(e)
    }
}
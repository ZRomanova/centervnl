const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiPosts = require('../api/controllers/posts')
const apiShops = require('../api/controllers/shops')
const moment = require('moment')

moment.locale('ru')

module.exports.getNewsListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.query.filter_visible = true
        await apiPosts.getPosts(req, res, (req, res, posts) => {
            posts.forEach(post => {
                post.date = moment(post.date).format('D MMMM yyyy')
            })
            result.posts = posts
        })
        
        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            // contacts.tel = contacts.phone.replace('+7', '8')
            // contacts.tel = contacts.tel.replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        renderNewsListPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderNewsListPage = function(req, res, data) {
    res.render('posts-list', {
        title: 'Новости',
        programs: data.programs, 
        contacts: data.contacts,
        session: req.session,
        posts: data.posts,
        shops: data.shops
    })
}

module.exports.getNewsPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        req.query.filter_visible = true
        await apiPosts.getPostByPath(req, res, (req, res, post) => {
            post.date = moment(post.date).format('D MMMM yyyy')
            result.post = post
        })

        req.query.fields_name = 1
        req.query.fields_path = 1
        await apiPrograms.getPrograms(req, res, (req, res, programs) => {
            result.programs = programs
        })
        await apiShops.getShops(req, res, (req, res, shops) => {
            result.shops = shops
        })
        req.params.type = "CONTACTS"
        await apiData.getByType(req, res, (req, res, contacts) => {
            // contacts.tel = contacts.phone.replace('+7', '8').replaceAll(/\D/g, '')
            result.contacts = contacts
        })
        renderPostPage(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderPostPage = function(req, res, data) {
    res.render('post', {
        title: data.post.name,
        programs: data.programs, 
        contacts: data.contacts, 
        session: req.session,
        post: data.post,
        shops: data.shops
    })
}

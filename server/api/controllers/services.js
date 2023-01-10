const Service = require('../models/services')
const Post = require('../models/posts')
const errorHandler = require('../utils/errorHandler')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
const moment = require('moment')

const week = [
    {num: 1, en:'monday', ru: 'ПН' },
    {num: 2,en: 'tuesday',ru: 'ВТ'},
    {num: 3, en: 'wednesday', ru: 'СР'},
    {num: 4, en: 'thursday', ru: 'ЧТ'},
    {num: 5, db: 'friday', ru: 'ПТ'},
    {num: 6, en: 'saturday', ru: 'СБ'},
    {num: 0, en: 'sunday', ru: 'ВС'}
  ]

module.exports.getAnouncementsByDay = async function(req, res, next) {
    try {
        const queryDate = req.params.day ? new Date(req.params.day) : new Date()
        const start = moment(queryDate).startOf('day');
        const end = moment(queryDate).endOf('day');
        const day = moment(queryDate).day();
        const dayStr = week.find(el => el.num == day).ru

        const events = await Service.find(
            {
                visible: true, 
                $or: [{
                    'date.single': {$gte: start, $lte: end}
                    },{
                    'date.period': {
                        $elemMatch: {
                            start: {$lte: end}, 
                            $or: [{end: {$gte: start}}, {end: null}, {end: {$exists: false}}], 
                            time: {$exists: true},
                            day: {$exists: true},
                            visible: true,
                            day: dayStr
                        }
                    }
                }]
            },{
                name: 1, path: 1, image: 1, description: 1, date: 1
            }).lean()
            
        results = []
        for (let event of events) {
            if (event.date.single && event.date.single.length) {
                event.date.single.forEach(date => {
                    if (moment(date) > start && moment(date) < end) {
                        results.push({
                            ...event,
                            dateStr: moment(date).format('D MMMM HH:mm'),
                            dateObj: Date.parse(date),
                        })
                    }
                })
            }

            if (event.date.period && event.date.period.length) {
                event.date.period.forEach(p =>  {
                    if (p.visible && p.day == dayStr) {
                        let startP = moment(p.start).startOf('day');
                        let endP = moment(p.end ? p.end : new Date().parse() + 1000 * 60 * 60 * 60 * 24 * 7 * 10).endOf('day')
                        if (startP <= start && endP >= end) {
                            let time = intToStringTime(p.time)
                            let dateTime = new Date(queryDate).setHours(time[0], time[1])
                            results.push({
                                ...event,
                                dateStr: moment(dateTime).format('D MMMM HH:mm'),
                                dateObj: dateTime,
                            })
                        }
                    }
                })
            }
        }

        results.sort((a, b) => a.dateObj - b.dateObj)

        next(req, res, results)
    } catch (e) {
        // console.log(e)
        errorHandler(res, e)
    }
}

module.exports.getAnouncementsByMonth = async function(req, res, next) {
    try {
        const queryDate = req.params.month ? new Date(req.params.month) : new Date()
        const start = moment(queryDate).startOf('month');
        const end = moment(queryDate).endOf('month');
        
        const events = await Service.find(
            {
                visible: true, 
                $or: [{
                    'date.single': {$gte: start, $lte: end}
                    },{
                    'date.period': {
                        $elemMatch: {
                            start: {$lte: end}, 
                            $or: [{end: {$gte: start}}, {end: null}, {end: {$exists: false}}], 
                            time: {$exists: true},
                            day: {$exists: true},
                            visible: true
                        }
                    }
                }]
            },{date: 1}).lean()

        results = []
        for (let event of events) {
            if (event.date.single && event.date.single.length) {
                event.date.single.forEach(date => {
                    if (moment(date) >= start && moment(date) <= end) {
                        results.push(moment(date).format('yyyy-MM-D'))
                    }
                })
            }

            if (event.date.period && event.date.period.length) {
                event.date.period.forEach(p =>  {
                    if (p.visible) {
                        let startP = new Date(p.start)
                        let endP = new Date(p.end ? p.end : new Date().parse() + 1000 * 60 * 60 * 60 * 24 * 7 * 10)
                        
                        if (startP < end && endP > start) {

                            let day = week.find(el => el.ru == p.day)?.num
                            let startDay = new Date(start).getDay()

                            let startI = start
                            while (day != startDay) {
                                startI = new Date(Date.parse(startI) + 1000 * 60 * 60 * 24)
                                startDay = new Date(startI).getDay()
                            }

                            while (startI < end) {
                                
                                results.push(moment(startI).format('yyyy-MM-D'))
                                startI = new Date(Date.parse(startI) + 1000 * 60 * 60 * 24 * 7)
                            }
                            
                        }
                    }
                })
            }
        }

        next(req, res, results)
    } catch (e) {
        console.log(e)
        errorHandler(res, e)
    }
}

module.exports.getServices = async function(req, res, next) {
    try {
        const filter = {}
        const fields = {}
        for (const str in req.query) {
            if (str.length > 7 && str.substring(0, 7) === "filter_") {
                filter[str.slice(7)] = req.query[str]
            } else if (str.length > 7 && str.substring(0, 7) === "fields_" && (+req.query[str] == 1 || +req.query[str] == 0)) {
                fields[str.slice(7)] = +req.query[str]
            }
        }
        const services = await Service
        .find(filter, fields)
        .skip(+req.query.offset)
        .limit(+req.query.limit)
        .sort({created: -1})
        .lean()

        next(req, res, services)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createService = async function(req, res, next) {
    try {
        const created = req.body
        created.author = req.user.id
        if (!created.path) created.path = cyrillicToTranslit().transform(created.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else created.path = cyrillicToTranslit().transform(created.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const service = await new Service(created).save()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateService = async function(req, res, next) {
    try {
        const updated = req.body
        updated.lastChange = {
            author: req.user.id,
            time: new Date()
        }
        if (!updated.path) updated.path = cyrillicToTranslit().transform(updated.name, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        else updated.path = cyrillicToTranslit().transform(updated.path, "-").toLowerCase().replace(/[^a-z0-9-]/gi,'').replace(/\s+/gi,', ')
        const service = await Service.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getServiceById = async function(req, res, next) {
    try {
        const service = await Service.findById(req.params.id).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getServiceByPath = async function(req, res, next) {
    try {

        const services = await Service.aggregate([
            {
                $match: {path: req.params.path, visible: true}
            },
            { 
                $project: { created: 0, author: 0 }
            },
            {
                $lookup:
                {
                    from: 'tags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tagsObjArray'
                }
             },
             {
                $lookup:
                {
                    from: 'partners',
                    localField: 'partners',
                    foreignField: '_id',
                    as: 'partnersObjArray'
                }
                
            },
            {
               $lookup:
               {
                   from: 'projects',
                   localField: 'projects',
                   foreignField: '_id',
                   as: 'projectsObjArray'
               }
               
           }
        ])
        if (services.length) {
            const service = services[0]
            const posts = await Post.find({visible: true, posts: service._id}, {name: 1, description: 1, image: 1, path: 1, _id: 1}).sort({date: -1}).lean()
            next(req, res, {service, posts})
        }
        else 
            next(req, res, new Error("Мероприятие не найдено"))

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.uploadImagesService = async function(req, res, next) {
    try {
        const updated = {}
        if (req.files && req.files.image) updated['$set'] = {image: 'https://centervnl.ru/uploads/' + req.files.image[0].filename}
        if (req.files && req.files['gallery']) {
            let paths = req.files['gallery'].map(file => 'https://centervnl.ru/uploads/' + file.filename)
            updated['$addToSet'] = {gallery: {$each: paths}}
        }
        const service = await Service.findOneAndUpdate({_id: req.params.id}, updated, {new: true}).lean()
        next(req, res, service)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteService = async function(req, res, next) {
    try {
        await Service.deleteOne({_id: req.params.id})
        next(req, res, {message: "Удалено"})
    } catch (e) {
        errorHandler(res, e)
    }
}

const intToStringTime = (num) => {
    const hour = 1000 * 60 * 60 
    const minute = 1000 * 60
    let resH = Math.floor(num / hour) 
    let resM = Math.round((num - resH * hour) / minute)
    return [resH, resM]
}
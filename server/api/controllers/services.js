const Service = require('../models/services')
const Registration = require('../models/registrations')
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
        const start = moment(queryDate).startOf('month'); //strrt of month
        const end = moment(queryDate).endOf('month'); // end of month
        
        const events = await Service.find(
            {
                visible: true, 
                $or: [{
                    'date.single': {$gte: start, $lte: end}
                    },{
                    'date.period': {
                        $elemMatch: {
                            start: {$lte: end}, 
                            end: {$gte: start}, 
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
                        results.push(moment(date).format('yyyy-M-D'))
                    }
                })
            }

            if (event.date.period && event.date.period.length) {
                event.date.period.forEach(p =>  {
                    if (p.visible) {
                        let startP = new Date(p.start) //period start
                        let endP = new Date(p.end) //period end
                        
                        if (startP < end && start < endP) {

                            let day = week.find(el => el.ru == p.day)?.num
                            let startDay = new Date(start).getDay()

                            let currI = start > startP ? start : startP
                            while (day != startDay) {
                                currI = new Date(Date.parse(currI) + 1000 * 60 * 60 * 24)
                                startDay = new Date(currI).getDay()
                            }

                            while (currI < end && currI < endP) {
                                
                                results.push(moment(currI).format('yyyy-M-D'))
                                currI = new Date(Date.parse(currI) + 1000 * 60 * 60 * 24 * 7)
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
        
        const service = await Service.findOne(
            {path: req.params.path, visible: true},
            { date: 1, gallery: 1, name: 1, path: 1, peopleLimit: 1, description: 1, address: 1, image: 1}
        ).lean()
        
        if (service) {

            service.dates = []
            const now = new Date(new Date() - 1000 * 60 * 60 * 2)
            if (service.date.single && service.date.single.length) {
                await service.date.single.forEach(async(d) => {
                    if (new Date(d) > now) {
                        let count 
                        if (service.peopleLimit) count = await Registration.countDocuments(
                            {date: d, service: service._id, status: {$nin: ['отмена', 'ведущий']}})
                        if (count < service.peopleLimit || !service.peopleLimit) {
                            service.dates.push({text: moment(d).format('D MMMM HH:mm'), date: d, count })
                            service.active = true
                        } else {
                            service.dates.push({text: moment(d).format('D MMMM HH:mm (нет мест)'), date: d, count, closed: true })
                        }
                    }
                })
            }
            if (service.date.period && service.date.period.length) {
                await service.date.period.forEach(async(p) => {
                    if (p.visible) {
                        const day = week.find(el => el.ru == p.day).num
                        let iDate = new Date(now)
                        if (new Date(p.start) > now) iDate = new Date(p.start)
                        iDate.setHours(0)
                        iDate.setMinutes(0)
                        iDate.setSeconds(0)
                        iDate.setMilliseconds(p.time)
                        iDate = new Date(iDate)
                        if (iDate < now)
                            iDate = new Date(Date.parse(iDate) + (1000 * 60 * 60 * 24))
                        for (let i = 0; i < 7; i++) {
                            if (iDate.getDay() == day) break
                            iDate = new Date(Date.parse(iDate) + (1000 * 60 * 60 * 24))
                        }
                        const end = p.end ? new Date(p.end) : new Date(Date.parse(iDate) + (1000 * 60 * 60 * 24 * 28))
                        const dates = []
                        while (iDate <= end) {
                            dates.push(iDate)
                            iDate = new Date(Date.parse(iDate) + (1000 * 60 * 60 * 24 * 7))
                        }
                        await dates.forEach(async(iDate) => {
                            let count 
                            if (service.peopleLimit) count = await Registration.countDocuments(
                                {date: iDate, service: service._id, status: {$nin: ['отмена', 'ведущий']}})
                            if (count < service.peopleLimit || !service.peopleLimit) {
                                service.dates.push({text: moment(iDate).format('D MMMM HH:mm'), date: iDate, count})
                                service.active = true
                            } else {
                                service.dates.push({text: moment(iDate).format('D MMMM HH:mm (нет мест)'), date: iDate, count})   
                            }
                        })
                    }
                })
            }
            service.dates = service.dates.sort((a, b) => a.date - b.date)

            next(req, res, service)
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
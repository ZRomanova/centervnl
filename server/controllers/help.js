const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')
const moment = require('moment')
const request = require('request');

moment.locale('ru')

module.exports.getHelpList = async function (req, res) {
    try {
        const result = {}
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderHelpList(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderHelpList = function (req, res, data) {
    res.render('help-list', {
        title: 'Как помочь | Ресурсный центр Вера Надежда Любовь',
        programs: data.programs,
        contacts: data.contacts,
        session: req.session,
        shops: data.shops
    })

}


module.exports.getHelpDonate = async function (req, res) {
    try {
        const result = {}
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderHelpDonate(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderHelpDonate = function (req, res, data) {
    res.render('help-donate', {
        title: 'Сделать пожертвование',
        programs: data.programs,
        contacts: data.contacts,
        session: req.session,
        error: req.query.error,
        ip: req.ip,
        shops: data.shops
    })

}





module.exports.createDonation = async function (req, res) {
    try {
        request.post('https://api.cloudpayments.ru/payments/cards/charge', {
            headers: {
                "Authorization": "Basic " + Buffer.from("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba").toString('base64')
            },
            json: req.body,
        }, function (error, response, body) {
            let data = {}
            if (!error) {
                let model = body["Model"]
                if (!body["Success"] && body["Model"] && body["Model"]["AcsUrl"]) {
                    data = {
                        // "TermUrl": 'https://centervnl.ru/help/donate/',
                        "MD": model["TransactionId"],
                        "PaReq": model["PaReq"],
                        "AcsUrl": model["AcsUrl"],
                        "next": "3D"
                    };
                } else if (body["Success"]) {
                    data = {
                        "next": "finish",
                        "Token": model["Token"]
                    }
                } else {
                    data = {
                        "next": "error",
                        "message": model["CardHolderMessage"]
                    }
                }

            } else {
                data = {
                    ...error,
                    next: "error"
                }
            }
            res.status(200).json(data)
        })
    } catch (e) {
        console.log(e)
    }
}


module.exports.getDonateFinish = async function (req, res) {
    try {
        const result = {}
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderDonateFinish(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderDonateFinish = function (req, res, data) {
    res.render('help-finish', {
        title: 'Спасибо',
        header: 'От всего сердца благодарим Вас за пожертвование!',
        footer: 'По всем вопросам вы можете написать нам по адресу ',
        programs: data.programs,
        contacts: data.contacts,
        session: req.session,
        // ip: req.ip,
        shops: data.shops
    })
}


module.exports.createDonationFinish = async function (req, res) {
    try {
        request.post('https://api.cloudpayments.ru/payments/cards/post3ds', {
            headers: {
                "Authorization": "Basic " + Buffer.from("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba").toString('base64')
            },
            json: {
                "TransactionId": req.body["MD"],
                "PaRes": req.body["PaRes"]
            },
        }, function (error, response, body) {
            let data = {}
            if (!error) {
                let model = body["Model"]
                if (body["Success"]) {
                    res.redirect("/help/donate/finish")
                } else {
                    res.redirect("/help/donate?error=" + model["CardHolderMessage"] + '#error-text')
                }

            } else {
                data = {
                    ...error,
                    next: "error"
                }
                res.status(200).json(data)
            }

        })
    } catch (e) {
        console.log(e)
    }
}





module.exports.createSubscription = async function (req, res) {
    try {
        request.post('https://api.cloudpayments.ru/payments/cards/post3ds', {
            headers: {
                "Authorization": "Basic " + Buffer.from("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba").toString('base64')
            },
            json: {
                "TransactionId": req.body["MD"],
                "PaRes": req.body["PaRes"]
            },
        }, function (error, response, body) {
            let data = {}
            if (!error) {
                let model = body["Model"]
                if (body["Success"]) {
                    request.post('https://api.cloudpayments.ru/subscriptions/create', {
                        headers: {
                            "Authorization": "Basic " + Buffer.from("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba").toString('base64')
                        },
                        json: {
                            "Token": model["Token"],
                            "AccountId": model["AccountId"],
                            "Description": model["Description"],
                            "Email": model["Email"],
                            "Amount": model["Amount"],
                            "Currency": model["Currency"],
                            "RequireConfirmation": false,
                            "StartDate": new Date(new Date().setMonth(new Date().getMonth() + 1)),
                            "Period": 1,
                            "Interval": "Month"

                        },
                    }, function (error, response, body) {

                        let model = body["Model"]
                        if (body["Success"]) {
                            res.redirect("/help/donate/subscribe")
                        } else {
                            res.redirect("/help/donate?error=" + model["CardHolderMessage"] + '#error-text')
                        }
                    })




                } else {
                    res.redirect("/help/donate?error=" + model["CardHolderMessage"] + '#error-text')
                }

            } else {
                data = {
                    ...error,
                    next: "error"
                }
                res.status(200).json(data)
            }

        })
        // res.status(200).json(req.body)
    } catch (e) {
        console.log(e)
    }
}


module.exports.getSubscriptionFinish = async function (req, res) {
    try {
        const result = {}
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderSubscriptionFinish(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderSubscriptionFinish = function (req, res, data) {
    res.render('help-finish', {
        title: 'Спасибо',
        header: 'От всего сердца благодарим Вас за подписку!',
        programs: data.programs,
        contacts: data.contacts,
        session: req.session,
        footer: 'Для отмены подписки и по всем другим вопросам вы можете написать нам по адресу ',
        shops: data.shops
    })

}


module.exports.getHelpVolunteer = async function (req, res) {
    try {
        const result = {
            page: 'help-volunteer',
            title: 'Стать волонтером'
        }
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        const activity = [
            'Проведение функциональных проб',
            'Включенное наблюдение',
            'Работа по собственному выбору в рамках индивидуальной исследовательской или проектной деятельности',
            'Сопровождение в столярной мастерской и оценка',
            'Сопровождение в швейной мастерской и оценка',
            'Сопровождение в печатной мастерской и оценка',
            'Сопровождение в бумажной мастерской и оценка',
            'Сопровождение в гончарной мастерской и оценка',
            'Сопровождение в свечной мастерской и оценка',
            'Сопровождение в мастерской мыловарения и оценка',
            'Сопровождение в клининге и оценка',
            'Сопровождение в сборке и оценка',
            'Сопровождение в кулинарии и оценка',
            'Сопровождение в упаковке и оценка',
            'Сопровождение в студии арт-дизайна и оценка',
            'Сопровождение на рабочем месте в музее и оценка',
            'Сопровождение на волонтерских сменах (плетение сетей)',
            'Сопровождение на волонтерских сменах (пошив тактических носилок)',
            'Сопровождение на волонтерских сменах (передачи гуманитарной помощи нуждающимся)',
            'Индивидуальное творческое сопровождение (творческий поиск занятия, интересного особому стажеру)',
            'Сопровождение ребят с низким слухом',
            'Разработка визуального помощника под конкретную задачу (создание эскиза)',
            'Фотосъёмка для визуального помощника',
            'Разработка дидактической игры (описание игры и эскизы частей игры)',
            'Верстка визуального помощника или дидактической игры (в дизайнерских программах по эскизу)',
            'Разработка компьютерного тренажера (написание задания для программиста)',
            'Разработка компьютерного тренажера по тех. заданию (HTML, CSS, JavaScript)',
            'Медиаосвещение мероприятия (фото/видеосъёмка и написание поста)',
            'Проведение независимой аттестации (оценка владения навыками по чек-листу)',
            'Преподавание в вечерней школе (отработка навыков с использованием компьютерных тренажеров)',
            'Проведение творческих мастер-классов',
            'Наставничество при подготовке мастер-класса',
            'Наставничество при подготовке экскурсии',
            'Работа с данными для анализа'
        ]
        result.activity = activity
        renderHelpVariant(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

module.exports.getHelpMillionPrizov = async function (req, res) {
    try {
        const result = {
            page: 'help-millpriz',
            title: 'Миллион призов'
        }
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderHelpVariant(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

module.exports.getHelpCorporate = async function (req, res) {
    try {
        const result = {
            page: 'help-corporate',
            title: 'Стать корпоративным партнером'
        }
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
        await apiShops.getShops(req, res, async (req, res, shops) => {
            result.shops = shops
        })
        renderHelpVariant(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

module.exports.getHelpMuseum = async function (req, res) {
    try {
        const result = {
            page: 'help-museum',
            title: 'Помочь экспонатами музею'
        }
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
        renderHelpVariant(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

module.exports.getHelpInfo = async function (req, res) {
    try {
        const result = {
            page: 'help-info',
            title: 'Стать информационным партнером'
        }
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
        renderHelpVariant(req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderHelpVariant = function (req, res, data) {
    res.render(data.page, data)
}
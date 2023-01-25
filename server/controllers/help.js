const apiPrograms = require('../api/controllers/programs')
const apiData = require('../api/controllers/data')
const apiShops = require('../api/controllers/shops')
const moment = require('moment')
const request = require('request');

moment.locale('ru')

module.exports.getHelpList = async function(req, res) {
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

const renderHelpList = function(req, res, data) {
    res.render('help-list', {
        title: 'Как помочь | Ресурсный центр Вера Надежда Любовь',
        programs: data.programs, 
        contacts: data.contacts, 
        session: req.session,
        shops: data.shops
    })
    
}


module.exports.getHelpDonate = async function(req, res) {
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
        renderHelpDonate (req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderHelpDonate  = function(req, res, data) {
    res.render('help-donate', {
        title: 'Сделать пожертвование | Ресурсный центр Вера Надежда Любовь',
        programs: data.programs, 
        contacts: data.contacts, 
        session: req.session,
        error: req.query.error,
        ip: req.ip,
        shops: data.shops
    })
    
}





module.exports.createDonation = async function(req, res) {
    try {
        request.post('https://api.cloudpayments.ru/payments/cards/charge', {
            headers: {
                "Authorization": "Basic " + btoa("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba")
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
      } catch(e) {
        console.log(e)
      }
}




module.exports.getDonateFinish = async function(req, res) {
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
        renderDonateFinish (req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderDonateFinish  = function(req, res, data) {
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


module.exports.createDonationFinish = async function(req, res) {
    try {
        request.post('https://api.cloudpayments.ru/payments/cards/post3ds', {
            headers: {
                "Authorization": "Basic " + btoa("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba")
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
                    res.redirect("/help/donate?error="+model["CardHolderMessage"]+'#error-text')
                }

            } else {
                data = {
                    ...error,
                    next: "error"
                }
                res.status(200).json(data)
            }
          
        })
      } catch(e) {
        console.log(e)
      }
}





module.exports.createSubscription = async function(req, res) {
    try {
        request.post('https://api.cloudpayments.ru/payments/cards/post3ds', {
            headers: {
                "Authorization": "Basic " + btoa("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba")
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
                            "Authorization": "Basic " + btoa("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba")
                        },
                        json: {
                            "Token": model["Token"],
                            "AccountId": model["AccountId"],
                            "Description": model["Description"],
                            "Email": model["Email"],
                            "Amount": model["Amount"],
                            "Currency": model["Currency"],
                            "RequireConfirmation": false,
                            "StartDate": new Date(new Date().setMonth(new Date().getMonth()+1)),
                            "Period": 1,
                            "Interval": "Month"

                        },
                    }, function(error, response, body){

                        let model = body["Model"]
                        if (body["Success"]) {
                            res.redirect("/help/donate/subscribe")
                        } else {
                            res.redirect("/help/donate?error="+model["CardHolderMessage"]+'#error-text')
                        }
                    })


                    

                } else {
                    res.redirect("/help/donate?error="+model["CardHolderMessage"]+'#error-text')
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
      } catch(e) {
        console.log(e)
      }
}


module.exports.getSubscriptionFinish = async function(req, res) {
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
        renderSubscriptionFinish (req, res, result)
    } catch (e) {
        console.log(e)
    }
}

const renderSubscriptionFinish  = function(req, res, data) {
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
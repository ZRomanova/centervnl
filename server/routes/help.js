const express = require('express');
const router = express.Router();
const {isAuth} = require('../middleware/auth')
const controller = require('../controllers/help');

router.get('/', controller.getHelpList) 
router.get('/donate', controller.getHelpDonate) 
router.get('/donate/finish', controller.getDonateFinish) 
router.post('/donate', controller.createDonation) 
router.post('/donate/finish', controller.createDonationFinish)

router.post('/donate/subscribe', controller.createSubscription)
router.get('/donate/subscribe', controller.getSubscriptionFinish)
router.get('/donate/tbank', controller.getHelpDonateTbank);
router.get('/donate/sber', controller.getHelpDonateSber);
router.get('/donate/alfa', controller.getHelpDonateAlfa);
router.get('/donate/vtb',  controller.getHelpDonateVtb);

router.get('/volunteer', controller.getHelpVolunteer)
router.get('/million-prizov', controller.getHelpMillionPrizov)
router.get('/info', controller.getHelpInfo)
router.get('/corporate', controller.getHelpCorporate)
router.get('/museum', controller.getHelpMuseum)

module.exports = router;